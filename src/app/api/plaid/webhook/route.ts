import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncTransactions } from '@/lib/sync';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { webhook_type, webhook_code, item_id, error } = body;

    console.log(`[Plaid Webhook] Received ${webhook_type} - ${webhook_code} for item ${item_id}`);

    if (error) {
      console.error(`[Plaid Webhook] Error reported:`, error);
      // We could update the item status here if needed
      return NextResponse.json({ received: true });
    }

    // 1. Look up the item by Plaid's internal item_id
    const item = await prisma.plaidItem.findUnique({
      where: { itemId: item_id },
    });

    // 2. Prevent Race Condition: 
    // If the item doesn't exist yet, it means the /set-access-token route
    // hasn't finished writing to the DB. Return a 400 to force Plaid to retry later.
    if (!item) {
      console.warn(`[Plaid Webhook] Item ${item_id} not found in DB. Returning 400 to trigger retry.`);
      return NextResponse.json(
        { error: 'Item not found. Plaid should retry.' },
        { status: 400 }
      );
    }

    // 3. Handle specific webhook types
    if (webhook_type === 'TRANSACTIONS') {
      if (
        webhook_code === 'SYNC_UPDATES_AVAILABLE' ||
        webhook_code === 'INITIAL_UPDATE' ||
        webhook_code === 'DEFAULT_UPDATE' ||
        webhook_code === 'HISTORICAL_UPDATE'
      ) {
        // Run sync asynchronously so we can quickly return 200 OK to Plaid
        syncTransactions(item.id)
          .then(() => console.log(`[Plaid Webhook] Async sync completed for item ${item.id}`))
          .catch((err) => console.error(`[Plaid Webhook] Async sync failed for item ${item.id}`, err));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Plaid Webhook] Failed to process webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

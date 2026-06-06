export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncTransactions } from '@/lib/sync';

export async function GET() {
  try {
    const items = await prisma.plaidItem.findMany();
    let totalAdded = 0;
    
    for (const item of items) {
      console.log(`Syncing item ${item.itemId}`);
      await syncTransactions(item.id);
      totalAdded += 1;
    }
    
    return NextResponse.json({ success: true, totalAdded, time: Date.now() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack, time: Date.now() });
  }
}

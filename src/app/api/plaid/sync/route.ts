import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { syncTransactions, syncLiabilities } from '@/lib/sync';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Fetch all plaid items for this user
    const items = await prisma.plaidItem.findMany({
      where: { userId }
    });

    for (const item of items) {
      try {
        await syncTransactions(item.id);
        await syncLiabilities(item.id);
      } catch (err) {
        console.error(`Failed to sync item ${item.id}`, err);
      }
    }

    return NextResponse.json({ success: true, message: 'Synced successfully' });
  } catch (error) {
    console.error('Manual sync failed:', error);
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
  }
}

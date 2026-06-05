import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // TODO: Ideally filter by the user's transactions. For now, we ensure the user is authenticated.
    const matches = await prisma.reconciliationMatch.findMany({
      // where: { debitTx: { account: { item: { userId } } } }, // Requires schema update for relations on ReconciliationMatch
      orderBy: { matchDate: 'desc' },
      take: 5
    });

    return NextResponse.json({ success: true, matches });
  } catch (error) {
    console.error('Error fetching reconciliation status:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

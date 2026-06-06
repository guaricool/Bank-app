import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  const txCount = await prisma.transaction.count();
  const accs = await prisma.bankAccount.findMany({
    include: { _count: { select: { transactions: true } } }
  });
  
  return NextResponse.json({
    txCount,
    accounts: accs.map(a => ({ name: a.name, type: a.type, subtype: a.subtype, txs: a._count.transactions }))
  });
}

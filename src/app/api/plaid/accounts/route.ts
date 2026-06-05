import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const accounts = await prisma.bankAccount.findMany({
      where: {
        item: {
          userId: userId
        }
      },
      include: {
        item: {
          select: {
            institutionName: true
          }
        }
      }
    });

    // Categorize into Assets (depository, investment) and Liabilities (credit, loan)
    const assets = accounts.filter((acc: any) => acc.type === 'depository' || acc.type === 'investment');
    const liabilities = accounts.filter((acc: any) => acc.type === 'credit' || acc.type === 'loan');
    const other = accounts.filter((acc: any) => !['depository', 'investment', 'credit', 'loan'].includes(acc.type));

    return NextResponse.json({
      success: true,
      data: {
        assets,
        liabilities,
        other
      }
    });

  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

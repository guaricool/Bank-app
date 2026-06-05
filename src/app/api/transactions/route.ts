import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          include: {
            // Need to map to PlaidItem or BankAccount? Wait, Transaction is linked to BankAccount
            // User -> items (PlaidItem) -> accounts (BankAccount) -> transactions
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const plaidItems = await prisma.plaidItem.findMany({
      where: { userId: user.id },
      include: {
        accounts: {
          include: {
            transactions: {
              orderBy: { date: 'desc' },
              take: 100
            }
          }
        }
      }
    });

    let allTransactions: any[] = [];
    plaidItems.forEach(item => {
      item.accounts.forEach(acc => {
        allTransactions = allTransactions.concat(acc.transactions);
      });
    });

    // Sort all descending
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Grouping by personalFinanceCategory
    const groupedTransactions: Record<string, any[]> = {};
    allTransactions.forEach(tx => {
      // Basic grouping: use primary category or generic
      let category = tx.personalFinanceCategory || 'Other';
      
      // Attempt to map to common categories if possible
      const catLower = category.toLowerCase();
      if (catLower.includes('grocer') || catLower.includes('supermarket')) category = 'Grocery';
      else if (catLower.includes('food') || catLower.includes('dining') || catLower.includes('restaurant')) category = 'Dining';
      else if (catLower.includes('gas') || catLower.includes('fuel') || catLower.includes('transport')) category = 'Gas';
      else if (catLower.includes('rent') || catLower.includes('mortgage') || catLower.includes('housing')) category = 'Housing';
      
      if (!groupedTransactions[category]) {
        groupedTransactions[category] = [];
      }
      groupedTransactions[category].push(tx);
    });

    return NextResponse.json({ transactions: allTransactions, grouped: groupedTransactions });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  apr: number; // e.g., 0.15 for 15%
  minimumPayment: number;
}

export interface ProjectionMonth {
  month: number;
  totalBalance: number;
  totalInterestPaid: number;
  debts: { id: string; balance: number }[];
}

export interface PayoffProjection {
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalPaid: number;
  timeline: ProjectionMonth[];
}

/**
 * Core engine for simulating debt payoff.
 * @param initialDebts Array of debts
 * @param extraCash Additional monthly payment above total minimums
 * @param strategy "SNOWBALL" (lowest balance first) or "AVALANCHE" (highest APR first)
 */
export function calculatePayoff(
  initialDebts: Debt[],
  extraCash: number,
  strategy: 'SNOWBALL' | 'AVALANCHE'
): PayoffProjection {
  // Deep copy to avoid mutating inputs
  let debts = initialDebts.map((d) => ({ ...d }));

  let totalInterestPaid = 0;
  let months = 0;
  const timeline: ProjectionMonth[] = [];

  // Edge case: no debts
  if (debts.reduce((sum, d) => sum + d.balance, 0) <= 0) {
    return { monthsToPayoff: 0, totalInterestPaid: 0, totalPaid: 0, timeline: [] };
  }

  // Safety net to prevent infinite loops (e.g. minimum payments don't cover interest)
  const MAX_MONTHS = 1200; // 100 years

  while (debts.some((d) => d.balance > 0) && months < MAX_MONTHS) {
    months++;
    let monthInterest = 0;
    
    // Sort to determine the target debt for extra payments
    if (strategy === 'SNOWBALL') {
      // Smallest balance first
      debts.sort((a, b) => a.balance - b.balance);
    } else {
      // Highest APR first
      debts.sort((a, b) => b.apr - a.apr);
    }

    // 1. Accumulate interest for the month
    for (const debt of debts) {
      if (debt.balance > 0) {
        const monthlyInterest = debt.balance * (debt.apr / 12);
        debt.balance += monthlyInterest;
        monthInterest += monthlyInterest;
      }
    }
    totalInterestPaid += monthInterest;

    // 2. Base payments + Rollover
    let availableCash = extraCash;

    // First, allocate minimum payments to all debts that still have a balance
    for (const debt of debts) {
      if (debt.balance > 0) {
        // If the balance is less than the minimum payment, we only pay the balance
        const payment = Math.min(debt.minimumPayment, debt.balance);
        debt.balance -= payment;
        // Any remainder of the minimum payment is added to the "snowball" (rollover)
        availableCash += (debt.minimumPayment - payment);
      } else {
        // Debt is already paid off, its entire minimum payment rolls over
        availableCash += debt.minimumPayment;
      }
    }

    // 3. Apply available extra cash to the targeted debt
    for (const debt of debts) {
      if (availableCash <= 0) break;
      if (debt.balance > 0) {
        const extraPayment = Math.min(availableCash, debt.balance);
        debt.balance -= extraPayment;
        availableCash -= extraPayment;
      }
    }

    // 4. Record state
    timeline.push({
      month: months,
      totalBalance: debts.reduce((sum, d) => sum + d.balance, 0),
      totalInterestPaid,
      debts: debts.map((d) => ({ id: d.id, balance: d.balance })),
    });
  }

  const initialTotal = initialDebts.reduce((sum, d) => sum + d.balance, 0);

  return {
    monthsToPayoff: months,
    totalInterestPaid,
    totalPaid: initialTotal + totalInterestPaid,
    timeline,
  };
}

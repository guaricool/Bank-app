export interface DebtInput {
  id: string;
  name: string;
  accountName?: string;
  balance: number;
  apr: number; // e.g. 24.99
  minimumPayment: number;
  creditLimit?: number;
  dueDate?: number;
}

export type StrategyType = "AVALANCHE" | "SNOWBALL";

export interface DebtPayoffResult {
  strategy: StrategyType;
  totalMonths: number;
  payoffDate: string;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  interestSavedVsMin: number;
  monthsSavedVsMin: number;
  payoffOrder: {
    id: string;
    name: string;
    monthsToPayoff: number;
    payoffDate: string;
    totalInterest: number;
  }[];
  monthlyBalances: {
    month: number;
    dateLabel: string;
    totalBalance: number;
    totalInterestAccumulated: number;
  }[];
}

export function calculateDebtPayoff(
  debts: DebtInput[],
  strategy: StrategyType = "AVALANCHE",
  extraMonthlyPayment: number = 0,
  lumpSum: number = 0
): DebtPayoffResult {
  if (!debts || debts.length === 0) {
    return {
      strategy,
      totalMonths: 0,
      payoffDate: "Already Debt-Free",
      totalInterestPaid: 0,
      totalPrincipalPaid: 0,
      interestSavedVsMin: 0,
      monthsSavedVsMin: 0,
      payoffOrder: [],
      monthlyBalances: [],
    };
  }

  // Calculate baseline (Minimum payments only, no extra money)
  const baseline = runSimulation(debts, strategy, 0, 0);

  // Calculate scenario with extra monthly payment & lump sum
  const scenario = runSimulation(debts, strategy, extraMonthlyPayment, lumpSum);

  return {
    ...scenario,
    interestSavedVsMin: Math.max(0, baseline.totalInterestPaid - scenario.totalInterestPaid),
    monthsSavedVsMin: Math.max(0, baseline.totalMonths - scenario.totalMonths),
  };
}

function runSimulation(
  initialDebts: DebtInput[],
  strategy: StrategyType,
  extraMonthlyPayment: number,
  lumpSum: number
) {
  // Clone debts for mutation in simulation
  let debts = initialDebts.map((d) => ({
    ...d,
    currentBalance: d.balance,
    accumulatedInterest: 0,
    paidOffMonth: -1,
  }));

  const totalPrincipal = debts.reduce((sum, d) => sum + d.balance, 0);

  // Apply lump sum to target debt first
  if (lumpSum > 0) {
    const sorted = sortDebts([...debts], strategy);
    let remainingLump = lumpSum;
    for (const target of sorted) {
      const debt = debts.find((d) => d.id === target.id)!;
      if (debt.currentBalance > 0) {
        const pay = Math.min(debt.currentBalance, remainingLump);
        debt.currentBalance -= pay;
        remainingLump -= pay;
        if (remainingLump <= 0) break;
      }
    }
  }

  let month = 0;
  const maxMonths = 360; // 30 years cap
  let totalInterestPaid = 0;
  const monthlyBalances: { month: number; dateLabel: string; totalBalance: number; totalInterestAccumulated: number }[] = [];
  const payoffOrderMap = new Map<string, { month: number; interest: number }>();

  const startDate = new Date();

  while (debts.some((d) => d.currentBalance > 0.01) && month < maxMonths) {
    month++;
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);
    const dateLabel = currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    // 1. Accrue monthly interest
    for (const d of debts) {
      if (d.currentBalance > 0) {
        const monthlyRate = d.apr / 100 / 12;
        const interest = d.currentBalance * monthlyRate;
        d.currentBalance += interest;
        d.accumulatedInterest += interest;
        totalInterestPaid += interest;
      }
    }

    // 2. Determine available pool for extra payments
    let extraBudget = extraMonthlyPayment;

    // Sort active debts according to selected strategy
    const activeSorted = sortDebts(
      debts.filter((d) => d.currentBalance > 0),
      strategy
    );

    // 3. Pay minimum payments
    for (const d of debts) {
      if (d.currentBalance > 0) {
        const minPay = Math.min(d.currentBalance, d.minimumPayment);
        d.currentBalance -= minPay;
        if (d.currentBalance <= 0.01) {
          d.currentBalance = 0;
          if (!payoffOrderMap.has(d.id)) {
            payoffOrderMap.set(d.id, { month, interest: d.accumulatedInterest });
          }
          // Freed up minimum payment goes to extra pool
          extraBudget += d.minimumPayment - minPay;
        }
      }
    }

    // 4. Apply extra budget to priority target debt
    for (const target of activeSorted) {
      const debt = debts.find((d) => d.id === target.id)!;
      if (debt.currentBalance > 0 && extraBudget > 0) {
        const extraPay = Math.min(debt.currentBalance, extraBudget);
        debt.currentBalance -= extraPay;
        extraBudget -= extraPay;

        if (debt.currentBalance <= 0.01) {
          debt.currentBalance = 0;
          if (!payoffOrderMap.has(debt.id)) {
            payoffOrderMap.set(debt.id, { month, interest: debt.accumulatedInterest });
          }
        }
      }
    }

    const currentTotalBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0);
    monthlyBalances.push({
      month,
      dateLabel,
      totalBalance: Math.round(currentTotalBalance * 100) / 100,
      totalInterestAccumulated: Math.round(totalInterestPaid * 100) / 100,
    });
  }

  const finalDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);
  const payoffDate = finalDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const payoffOrder = initialDebts.map((d) => {
    const res = payoffOrderMap.get(d.id) || { month, interest: 0 };
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + res.month, 1);
    return {
      id: d.id,
      name: d.name,
      monthsToPayoff: res.month,
      payoffDate: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      totalInterest: Math.round(res.interest * 100) / 100,
    };
  });

  return {
    strategy,
    totalMonths: month,
    payoffDate,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalPrincipalPaid: Math.round(totalPrincipal * 100) / 100,
    payoffOrder,
    monthlyBalances,
  };
}

function sortDebts<T extends { apr: number; currentBalance: number }>(debts: T[], strategy: StrategyType): T[] {
  return debts.sort((a, b) => {
    if (strategy === "AVALANCHE") {
      // Highest APR first
      return b.apr - a.apr;
    } else {
      // Smallest balance first (Snowball)
      return a.currentBalance - b.currentBalance;
    }
  });
}

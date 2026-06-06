import type { Debt } from './financialMath';
import { calculatePayoff } from './financialMath';

export type { Debt } from './financialMath';

export type PayoffStrategy = 'AVALANCHE' | 'SNOWBALL';

export interface DebtProjection {
  strategy: PayoffStrategy;
  extraPayment: number;
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalPaid: number;
  interestSavedVsMinimum: number;
  monthsSavedVsMinimum: number;
}

export interface SensitivityRow {
  extraPayment: number;
  monthsToPayoff: number;
  totalInterestPaid: number;
  interestSaved: number;
}

export interface MinimumPaymentTrapResult {
  debtId: string;
  debtName: string;
  monthlyInterest: number;
  minimumPayment: number;
  isTrap: boolean;
  surplusOrDeficit: number;
}

export interface BaselineResult {
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalPaid: number;
}

export function getMinimumOnlyBaseline(
  accounts: Debt[],
  strategy: PayoffStrategy
): BaselineResult {
  const result = calculatePayoff(accounts, 0, strategy);
  return {
    monthsToPayoff: result.monthsToPayoff,
    totalInterestPaid: result.totalInterestPaid,
    totalPaid: result.totalPaid,
  };
}

export function runProjection(
  accounts: Debt[],
  extraMonthlyPayment: number,
  strategy: PayoffStrategy,
  baseline?: BaselineResult
): DebtProjection {
  const result = calculatePayoff(accounts, extraMonthlyPayment, strategy);
  const minimumOnly = baseline ?? getMinimumOnlyBaseline(accounts, strategy);

  return {
    strategy,
    extraPayment: extraMonthlyPayment,
    monthsToPayoff: result.monthsToPayoff,
    totalInterestPaid: result.totalInterestPaid,
    totalPaid: result.totalPaid,
    interestSavedVsMinimum: Math.max(0, minimumOnly.totalInterestPaid - result.totalInterestPaid),
    monthsSavedVsMinimum: Math.max(0, minimumOnly.monthsToPayoff - result.monthsToPayoff),
  };
}

export function runSensitivityTable(
  accounts: Debt[],
  strategy: PayoffStrategy,
  steps: number[] = [0, 50, 100, 200, 500, 1000]
): SensitivityRow[] {
  const base = calculatePayoff(accounts, 0, strategy);
  return steps.map(extra => {
    const result = calculatePayoff(accounts, extra, strategy);
    return {
      extraPayment: extra,
      monthsToPayoff: result.monthsToPayoff,
      totalInterestPaid: result.totalInterestPaid,
      interestSaved: Math.max(0, base.totalInterestPaid - result.totalInterestPaid),
    };
  });
}

export function detectMinimumPaymentTrap(accounts: Debt[]): MinimumPaymentTrapResult[] {
  return accounts.map(debt => {
    const monthlyInterest = debt.balance * (debt.apr / 12);
    const surplus = debt.minimumPayment - monthlyInterest;
    // Trap if less than 0.5% of balance goes to principal per month
    const isTrap = surplus < debt.balance * 0.005;
    return {
      debtId: debt.id,
      debtName: debt.name,
      monthlyInterest,
      minimumPayment: debt.minimumPayment,
      isTrap,
      surplusOrDeficit: surplus,
    };
  });
}

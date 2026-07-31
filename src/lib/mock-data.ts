import { DebtInput } from "./debt-engine";

export interface MockAccount {
  id: string;
  name: string;
  officialName?: string;
  institution: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "LOAN" | "MORTGAGE" | "INVESTMENT" | "ASSET";
  currentBalance: number;
  availableBalance?: number;
  creditLimit?: number;
  isLiability: boolean;
  apr?: number;
  minimumPayment?: number;
  dueDate?: number;
}

export interface MockTransaction {
  id: string;
  accountName: string;
  amount: number; // positive = expense, negative = income
  date: string;
  name: string;
  merchantName: string;
  category: string;
  pending: boolean;
}

export interface NetWorthHistoryPoint {
  date: string;
  assets: number;
  liabilities: number;
  netWorth: number;
  burnRate: number;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  // Assets
  {
    id: "acc-1",
    name: "Primary Checking",
    officialName: "Chase Total Checking",
    institution: "Chase Bank",
    type: "CHECKING",
    currentBalance: 18450.0,
    availableBalance: 18450.0,
    isLiability: false,
  },
  {
    id: "acc-2",
    name: "High Yield Emergency Fund",
    officialName: "Marcus Online Savings",
    institution: "Goldman Sachs",
    type: "SAVINGS",
    currentBalance: 45200.0,
    availableBalance: 45200.0,
    isLiability: false,
  },
  {
    id: "acc-3",
    name: "Vanguard Taxable Brokerage",
    officialName: "Vanguard Brokerage Account",
    institution: "Vanguard",
    type: "INVESTMENT",
    currentBalance: 185000.0,
    isLiability: false,
  },
  {
    id: "acc-4",
    name: "Primary Residence Valuation",
    officialName: "Zillow Estimate / Appraisal",
    institution: "Real Estate Asset",
    type: "ASSET",
    currentBalance: 295000.0,
    isLiability: false,
  },

  // Liabilities (Debts & Credit Cards)
  {
    id: "acc-5",
    name: "Chase Freedom Flex",
    officialName: "Chase Freedom Flex Card",
    institution: "Chase Bank",
    type: "CREDIT_CARD",
    currentBalance: 3840.0,
    creditLimit: 12000.0,
    isLiability: true,
    apr: 24.99,
    minimumPayment: 145.0,
    dueDate: 15,
  },
  {
    id: "acc-6",
    name: "Amex Gold Card",
    officialName: "American Express Gold",
    institution: "American Express",
    type: "CREDIT_CARD",
    currentBalance: 1420.0,
    creditLimit: 5000.0,
    isLiability: true,
    apr: 21.49,
    minimumPayment: 85.0,
    dueDate: 22,
  },
  {
    id: "acc-7",
    name: "Auto Loan",
    officialName: "Toyota Financial Services",
    institution: "Toyota Financial",
    type: "LOAN",
    currentBalance: 16500.0,
    isLiability: true,
    apr: 6.29,
    minimumPayment: 385.0,
    dueDate: 5,
  },
  {
    id: "acc-8",
    name: "Federal Student Loan",
    officialName: "Nelnet Direct Loan",
    institution: "Nelnet",
    type: "LOAN",
    currentBalance: 14200.0,
    isLiability: true,
    apr: 5.25,
    minimumPayment: 210.0,
    dueDate: 28,
  },
];

export const MOCK_DEBTS: DebtInput[] = MOCK_ACCOUNTS.filter(
  (a) => a.isLiability && a.apr && a.minimumPayment
).map((a) => ({
  id: a.id,
  name: a.name,
  accountName: a.institution,
  balance: a.currentBalance,
  apr: a.apr!,
  minimumPayment: a.minimumPayment!,
  creditLimit: a.creditLimit,
  dueDate: a.dueDate,
}));

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: "tx-1",
    accountName: "Chase Freedom Flex",
    amount: 142.80,
    date: "2026-07-29",
    name: "WHOLEFOODS MKT 1042",
    merchantName: "Whole Foods Market",
    category: "Groceries",
    pending: false,
  },
  {
    id: "tx-2",
    accountName: "Amex Gold Card",
    amount: 68.50,
    date: "2026-07-28",
    name: "SHELL OIL 574219",
    merchantName: "Shell",
    category: "Transportation",
    pending: false,
  },
  {
    id: "tx-3",
    accountName: "Primary Checking",
    amount: 385.00,
    date: "2026-07-25",
    name: "TOYOTA FIN AUTO PAY",
    merchantName: "Toyota Financial",
    category: "Debt Payments",
    pending: false,
  },
  {
    id: "tx-4",
    accountName: "Chase Freedom Flex",
    amount: 19.99,
    date: "2026-07-24",
    name: "NETFLIX.COM",
    merchantName: "Netflix",
    category: "Entertainment",
    pending: false,
  },
  {
    id: "tx-5",
    accountName: "Primary Checking",
    amount: 2450.00,
    date: "2026-07-20",
    name: "MORTGAGE PAYMENT PNC",
    merchantName: "PNC Mortgage",
    category: "Housing",
    pending: false,
  },
  {
    id: "tx-6",
    accountName: "Amex Gold Card",
    amount: 84.12,
    date: "2026-07-18",
    name: "UBER EATS ORDER #891",
    merchantName: "Uber Eats",
    category: "Dining Out",
    pending: false,
  },
  {
    id: "tx-7",
    accountName: "Primary Checking",
    amount: -4850.00,
    date: "2026-07-15",
    name: "ACME CORP DIRECT DEP",
    merchantName: "Acme Corp (Payroll)",
    category: "Income",
    pending: false,
  },
  {
    id: "tx-8",
    accountName: "Chase Freedom Flex",
    amount: 215.00,
    date: "2026-07-12",
    name: "CON EDISON ELECTRIC",
    merchantName: "ConEd",
    category: "Utilities",
    pending: false,
  },
];

export const MOCK_NET_WORTH_HISTORY: NetWorthHistoryPoint[] = [
  { date: "Aug 2025", assets: 485000, liabilities: 42500, netWorth: 442500, burnRate: 5450 },
  { date: "Sep 2025", assets: 492000, liabilities: 41200, netWorth: 450800, burnRate: 5310 },
  { date: "Oct 2025", assets: 498500, liabilities: 40100, netWorth: 458400, burnRate: 5600 },
  { date: "Nov 2025", assets: 504000, liabilities: 39400, netWorth: 464600, burnRate: 5120 },
  { date: "Dec 2025", assets: 512000, liabilities: 38800, netWorth: 473200, burnRate: 6100 },
  { date: "Jan 2026", assets: 518500, liabilities: 38200, netWorth: 480300, burnRate: 5200 },
  { date: "Feb 2026", assets: 524000, liabilities: 37600, netWorth: 486400, burnRate: 5150 },
  { date: "Mar 2026", assets: 529000, liabilities: 37100, netWorth: 491900, burnRate: 5340 },
  { date: "Apr 2026", assets: 534500, liabilities: 36800, netWorth: 497700, burnRate: 5190 },
  { date: "May 2026", assets: 538000, liabilities: 36400, netWorth: 501600, burnRate: 5420 },
  { date: "Jun 2026", assets: 541200, liabilities: 36100, netWorth: 505100, burnRate: 5300 },
  { date: "Jul 2026", assets: 543650, liabilities: 35960, netWorth: 507690, burnRate: 5280 },
];

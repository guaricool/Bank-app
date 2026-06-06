import { redirect } from 'next/navigation';

// The strategy tool has been consolidated into /dashboard/debts
export default function StrategyPage() {
  redirect('/dashboard/debts');
}

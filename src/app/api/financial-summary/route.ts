import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Fetch accounts strictly for current user
    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      include: {
        debt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch transactions strictly for current user
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 20,
    });

    // Fetch debts strictly for current user
    const debts = await prisma.debt.findMany({
      where: { userId: user.id },
      include: {
        account: true,
      },
    });

    // Calculate totals
    let totalAssets = 0;
    let totalDebts = 0;
    let liquidAssets = 0;

    const liquidAccounts: any[] = [];
    const debtAccounts: any[] = [];

    accounts.forEach((acc) => {
      const balance = Number(acc.currentBalance);
      if (acc.type === "CHECKING" || acc.type === "SAVINGS") {
        totalAssets += balance;
        liquidAssets += balance;
        liquidAccounts.push(acc);
      } else if (acc.type === "CREDIT_CARD" || acc.type === "LOAN" || acc.type === "MORTGAGE") {
        totalDebts += balance;
        debtAccounts.push(acc);
      } else if (acc.type === "ASSET" || acc.type === "INVESTMENT") {
        totalAssets += balance;
      }
    });

    const netWorth = totalAssets - totalDebts;

    return NextResponse.json({
      user,
      hasData: accounts.length > 0,
      summary: {
        netWorth,
        totalAssets,
        totalDebts,
        liquidAssets,
        accountCount: accounts.length,
      },
      accounts,
      liquidAccounts,
      debtAccounts,
      debts,
      transactions,
    });
  } catch (error: any) {
    console.error("Financial Summary Error:", error);
    return NextResponse.json({ error: "Error al obtener resumen financiero" }, { status: 500 });
  }
}

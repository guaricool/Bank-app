import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Create Plaid Item for user
    const plaidItem = await prisma.plaidItem.create({
      data: {
        userId: user.id,
        accessTokenEnc: "demo-access-token",
        itemId: `demo-item-${Date.now()}`,
        institutionName: "Chase & Capital One (Demo)",
        status: "ACTIVE",
      },
    });

    // 1. Savings & Checking Accounts
    const chk = await prisma.account.create({
      data: {
        userId: user.id,
        plaidItemId: plaidItem.id,
        name: "Cuenta Principal de Cheques",
        type: "CHECKING",
        subtype: "checking",
        currentBalance: 5420.50,
        availableBalance: 5420.50,
      },
    });

    const sav = await prisma.account.create({
      data: {
        userId: user.id,
        plaidItemId: plaidItem.id,
        name: "Fondo de Emergencia (Ahorros)",
        type: "SAVINGS",
        subtype: "savings",
        currentBalance: 12500.00,
        availableBalance: 12500.00,
      },
    });

    // 2. Debt Accounts (Credit Cards, Auto, Mortgage)
    const card1 = await prisma.account.create({
      data: {
        userId: user.id,
        plaidItemId: plaidItem.id,
        name: "Tarjeta Chase Sapphire Reserve",
        type: "CREDIT_CARD",
        subtype: "credit card",
        currentBalance: 2450.00,
        creditLimit: 12000.00,
      },
    });

    await prisma.debt.create({
      data: {
        userId: user.id,
        accountId: card1.id,
        balance: 2450.00,
        apr: 24.99,
        minimumPayment: 65.00,
        dueDate: 15,
        notes: "Tarjeta principal de consumos diarios",
      },
    });

    const card2 = await prisma.account.create({
      data: {
        userId: user.id,
        plaidItemId: plaidItem.id,
        name: "Tarjeta Capital One Venture",
        type: "CREDIT_CARD",
        subtype: "credit card",
        currentBalance: 1120.00,
        creditLimit: 8000.00,
      },
    });

    await prisma.debt.create({
      data: {
        userId: user.id,
        accountId: card2.id,
        balance: 1120.00,
        apr: 19.49,
        minimumPayment: 35.00,
        dueDate: 22,
        notes: "Gastos de viajes",
      },
    });

    const autoLoan = await prisma.account.create({
      data: {
        userId: user.id,
        plaidItemId: plaidItem.id,
        name: "Préstamo Vehículo (Tesla Model Y)",
        type: "LOAN",
        subtype: "auto loan",
        currentBalance: 18400.00,
      },
    });

    await prisma.debt.create({
      data: {
        userId: user.id,
        accountId: autoLoan.id,
        balance: 18400.00,
        apr: 5.49,
        minimumPayment: 420.00,
        dueDate: 5,
        notes: "Préstamo auto 48 meses",
      },
    });

    // 3. Transactions
    const now = new Date();
    await prisma.transaction.createMany({
      data: [
        {
          userId: user.id,
          accountId: chk.id,
          amount: 3200.00,
          date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          name: "Nómina / Depósito Directo",
          merchantName: "Empresa",
          category: "Ingreso",
        },
        {
          userId: user.id,
          accountId: card1.id,
          amount: 142.50,
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          name: "Compra Supermercado Whole Foods",
          merchantName: "Whole Foods",
          category: "Alimentación",
        },
        {
          userId: user.id,
          accountId: card1.id,
          amount: 55.00,
          date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          name: "Gasolinera Shell",
          merchantName: "Shell",
          category: "Transporte",
        },
        {
          userId: user.id,
          accountId: chk.id,
          amount: 120.00,
          date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
          name: "Servicio de Luz FPL",
          merchantName: "FPL",
          category: "Servicios Públicos",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Seed Demo Error:", error);
    return NextResponse.json({ error: "Error al cargar datos demo" }, { status: 500 });
  }
}

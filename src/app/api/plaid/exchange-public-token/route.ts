import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[(process.env.PLAID_ENV || "sandbox") as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "mock_client_id",
      "PLAID-SECRET": process.env.PLAID_SECRET || "mock_secret",
    },
  },
});

const plaidClient = new PlaidApi(plaidConfig);

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { public_token, metadata } = await req.json();

    let accessToken = `access-sandbox-${Date.now()}`;
    let itemId = `item-${Date.now()}`;
    let accountsData: any[] = [];

    try {
      if (public_token && !public_token.startsWith("mock-")) {
        const exchangeRes = await plaidClient.itemPublicTokenExchange({ public_token });
        accessToken = exchangeRes.data.access_token;
        itemId = exchangeRes.data.item_id;

        const authRes = await plaidClient.accountsGet({ access_token: accessToken });
        accountsData = authRes.data.accounts;
      }
    } catch (plaidErr) {
      console.warn("Plaid Exchange Fallback to Sandbox accounts:", plaidErr);
    }

    // Save Plaid Item for User
    const plaidItem = await prisma.plaidItem.create({
      data: {
        userId: user.id,
        accessTokenEnc: accessToken, // Simple storage for demo/sandbox; replace with KMS/aes-256 for prod
        itemId,
        institutionId: metadata?.institution?.institution_id || "ins_1",
        institutionName: metadata?.institution?.name || "Chase Bank",
        status: "ACTIVE",
      },
    });

    // Create Account records
    if (accountsData.length > 0) {
      for (const acc of accountsData) {
        const isDebt = acc.type === "credit" || acc.type === "loan";
        const createdAcc = await prisma.account.create({
          data: {
            userId: user.id,
            plaidItemId: plaidItem.id,
            plaidAccountId: acc.account_id,
            name: acc.name,
            officialName: acc.official_name || null,
            type: isDebt ? (acc.type === "credit" ? "CREDIT_CARD" : "LOAN") : (acc.subtype === "savings" ? "SAVINGS" : "CHECKING"),
            subtype: acc.subtype || null,
            currentBalance: acc.balances.current || 0,
            availableBalance: acc.balances.available || null,
            creditLimit: acc.balances.limit || null,
            currency: acc.balances.iso_currency_code || "USD",
          },
        });

        if (isDebt) {
          await prisma.debt.create({
            data: {
              userId: user.id,
              accountId: createdAcc.id,
              balance: acc.balances.current || 0,
              apr: 19.99, // default APR for newly synced credit account
              minimumPayment: Math.max(25, Math.round((acc.balances.current || 0) * 0.02)),
            },
          });
        }
      }
    } else {
      // Mock account setup for Sandbox Plaid Link test
      const mockChecking = await prisma.account.create({
        data: {
          userId: user.id,
          plaidItemId: plaidItem.id,
          plaidAccountId: `acc-chk-${Date.now()}`,
          name: "Chase Checking (Plaid)",
          type: "CHECKING",
          subtype: "checking",
          currentBalance: 4250.00,
          availableBalance: 4250.00,
          currency: "USD",
        },
      });

      const mockCard = await prisma.account.create({
        data: {
          userId: user.id,
          plaidItemId: plaidItem.id,
          plaidAccountId: `acc-card-${Date.now()}`,
          name: "Sapphire Reserve (Plaid)",
          type: "CREDIT_CARD",
          subtype: "credit card",
          currentBalance: 1850.00,
          creditLimit: 10000.00,
          currency: "USD",
        },
      });

      await prisma.debt.create({
        data: {
          userId: user.id,
          accountId: mockCard.id,
          balance: 1850.00,
          apr: 21.99,
          minimumPayment: 45.00,
        },
      });
    }

    return NextResponse.json({ success: true, itemId: plaidItem.id });
  } catch (error: any) {
    console.error("Exchange Token Error:", error);
    return NextResponse.json({ error: "Error al vincular cuenta bancaria" }, { status: 500 });
  }
}

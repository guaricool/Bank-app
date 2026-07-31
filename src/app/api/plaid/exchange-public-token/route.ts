import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "sandbox_client_id",
      "PLAID-SECRET": process.env.PLAID_SECRET || "sandbox_secret",
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function POST(request: Request) {
  try {
    const { public_token } = await request.json();

    if (!public_token) {
      return NextResponse.json({ error: "Missing public_token" }, { status: 400 });
    }

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Fetch account balances immediately
    const authResponse = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
    });

    const accounts = authResponse.data.accounts;

    return NextResponse.json({
      success: true,
      item_id: itemId,
      account_count: accounts.length,
      accounts: accounts.map((a) => ({
        id: a.account_id,
        name: a.name,
        type: a.type,
        subtype: a.subtype,
        balance: a.balances.current,
        available: a.balances.available,
        limit: a.balances.limit,
      })),
    });
  } catch (error: any) {
    console.error("Plaid Exchange Token Error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: "Token Exchange Failed", details: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}

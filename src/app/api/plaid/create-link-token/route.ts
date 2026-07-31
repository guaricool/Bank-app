import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";

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

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: "Family Finance",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "es",
    });

    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error: any) {
    console.error("Plaid Create Link Token Error:", error?.response?.data || error);
    // Return mock link token for sandbox preview if keys are unconfigured
    return NextResponse.json({
      link_token: `mock-sandbox-link-token-${Date.now()}`,
      isMock: true,
    });
  }
}

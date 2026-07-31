import { NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";

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

export async function POST() {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: "user-carlos-123" },
      client_name: "Family Finance",
      products: [Products.Auth, Products.Transactions, Products.Liabilities],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error: any) {
    console.error("Plaid Link Token Error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: "Plaid Link Token Generation Failed", details: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}

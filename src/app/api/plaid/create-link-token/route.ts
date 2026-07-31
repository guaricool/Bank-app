import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[(process.env.PLAID_ENV || "sandbox") as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
      "PLAID-SECRET": process.env.PLAID_SECRET || "",
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

    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET || process.env.PLAID_CLIENT_ID === "mock_client_id") {
      return NextResponse.json(
        {
          error: "Credenciales de Plaid no configuradas en las variables de entorno de Coolify (PLAID_CLIENT_ID / PLAID_SECRET).",
          isMock: true,
        },
        { status: 400 }
      );
    }

    // Try creating link token with Transactions product first
    try {
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: user.id },
        client_name: "Family Finance",
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: "es",
      });

      return NextResponse.json({ link_token: response.data.link_token });
    } catch (primaryErr: any) {
      const plaidError = primaryErr?.response?.data;
      console.warn("Plaid Primary linkTokenCreate Error:", plaidError || primaryErr);

      // If transactions product threw, try fallback with auth product
      if (plaidError?.error_code === "INVALID_PRODUCT") {
        const fallbackRes = await plaidClient.linkTokenCreate({
          user: { client_user_id: user.id },
          client_name: "Family Finance",
          products: [Products.Auth],
          country_codes: [CountryCode.Us],
          language: "es",
        });
        return NextResponse.json({ link_token: fallbackRes.data.link_token });
      }

      throw primaryErr;
    }
  } catch (error: any) {
    const plaidError = error?.response?.data;
    console.error("Plaid Create Link Token Final Error:", plaidError || error);
    return NextResponse.json(
      {
        error: plaidError?.error_message || error?.message || "Error al conectar con la API de Plaid",
        code: plaidError?.error_code || "PLAID_ERROR",
      },
      { status: 400 }
    );
  }
}

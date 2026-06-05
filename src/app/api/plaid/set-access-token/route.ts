import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await request.json();
    const { publicToken } = body;

    if (!publicToken) {
      return NextResponse.json({ error: 'Public token is required' }, { status: 400 });
    }

    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Fetch item info (e.g., institution name)
    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,
    });
    const institutionId = itemResponse.data.item.institution_id;
    let institutionName = 'Unknown Institution';

    if (institutionId) {
      const instResponse = await plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: ['US'] as any,
      });
      institutionName = instResponse.data.institution.name;
    }

    // Encrypt the access token before saving to database
    const encryptedAccessToken = encrypt(accessToken);

    // Store the PlaidItem in the database securely
    const plaidItem = await prisma.plaidItem.upsert({
      where: { itemId: itemId },
      update: {
        accessToken: encryptedAccessToken,
        status: 'GOOD',
      },
      create: {
        itemId: itemId,
        accessToken: encryptedAccessToken,

        userId: userId,
        institutionId: institutionId || 'unknown',
        institutionName: institutionName,
        status: 'GOOD',
      },
    });

    // Fetch and store accounts immediately
    try {
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });

      const accounts = accountsResponse.data.accounts;

      // Upsert accounts inside a transaction for idempotency
      await prisma.$transaction(
        accounts.map((acc) =>
          prisma.bankAccount.upsert({
            where: { accountId: acc.account_id },
            update: {
              name: acc.name,
              officialName: acc.official_name || null,
              mask: acc.mask || null,
              type: acc.type,
              subtype: acc.subtype || null,
              currentBalance: acc.balances.current || null,
              availableBalance: acc.balances.available || null,
              isoCurrencyCode: acc.balances.iso_currency_code || null,
            },
            create: {
              accountId: acc.account_id,
              itemId: plaidItem.id,
              name: acc.name,
              officialName: acc.official_name || null,
              mask: acc.mask || null,
              type: acc.type,
              subtype: acc.subtype || null,
              currentBalance: acc.balances.current || null,
              availableBalance: acc.balances.available || null,
              isoCurrencyCode: acc.balances.iso_currency_code || null,
            },
          })
        )
      );
      console.log(`Successfully fetched and stored ${accounts.length} accounts for item ${itemId}`);
    } catch (accountsError) {
      console.error('Failed to fetch initial accounts from Plaid:', accountsError);
      // We don't throw here because the token exchange succeeded. 
      // Webhooks or manual sync can fetch the accounts later if this fails.
    }

    return NextResponse.json({ success: true, itemId });
  } catch (error: any) {
    console.error('Error exchanging public token:', error.response?.data || error);
    return NextResponse.json({ error: 'Failed to exchange public token' }, { status: 500 });
  }
}

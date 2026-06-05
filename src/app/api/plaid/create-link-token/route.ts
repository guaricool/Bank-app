import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { Products, CountryCode } from 'plaid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const requestObj = {
      user: {
        client_user_id: userId,
      },
      client_name: 'Bank App MVP',
      products: [Products.Transactions, Products.Liabilities],
      country_codes: [CountryCode.Us],
      language: 'en',
      webhook: process.env.PLAID_WEBHOOK_URL || 'https://example.com/api/plaid/webhook',
    };

    const response = await plaidClient.linkTokenCreate(requestObj);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating link token:', error.response?.data || error);
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 });
  }
}

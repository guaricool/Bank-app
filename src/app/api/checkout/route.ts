import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any, // Adjust to your preferred API version
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { familyId, email } = body;

    if (!familyId || !email) {
      return NextResponse.json({ error: 'Family ID and Email are required' }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    
    if (!priceId) {
      return NextResponse.json({ error: 'Stripe configuration is missing (STRIPE_PRICE_ID)' }, { status: 500 });
    }

    // Create a Checkout Session with a 5-day trial period
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 5, // Trial de 5 días solicitado por el usuario
        metadata: {
          familyId: familyId
        }
      },
      customer_email: email,
      client_reference_id: familyId,
      metadata: {
        familyId: familyId
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboarding`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

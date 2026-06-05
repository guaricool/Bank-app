import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find the token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    // Check expiration
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ error: 'Verification token has expired. Please register again or request a new one.' }, { status: 400 });
    }

    // Verify the user
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: {
        emailVerified: new Date(),
      }
    });

    // Delete the token
    await prisma.verificationToken.delete({
      where: { token }
    });

    return NextResponse.json({ success: true, message: 'Email verified successfully. You can now log in.' }, { status: 200 });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Set default preferences for alerts
        alertPreferences: {
          deposits: true,
          withdrawals: true,
          payments: true,
          closingDiscrepancy: true
        }
      },
    });

    // Generate Verification Token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    });

    // Send Email
    const { sendVerificationEmail } = await import('@/lib/email');
    const emailSent = await sendVerificationEmail(email, token);

    if (!emailSent) {
      // For development: if email fails (e.g. no API key), auto-verify the user so they can login.
      console.warn("Email sending failed. Auto-verifying user for development.");
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });
      return NextResponse.json({ success: true, message: 'Registration successful (auto-verified). You can now log in.', userId: user.id }, { status: 201 });
    }

    return NextResponse.json({ success: true, message: 'Registration successful. Please check your email to verify your account.', userId: user.id }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

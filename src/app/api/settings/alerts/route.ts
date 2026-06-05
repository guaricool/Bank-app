import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { alertPreferences: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ preferences: user.alertPreferences });
  } catch (error) {
    console.error('Failed to fetch alert preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        alertPreferences: body
      }
    });

    return NextResponse.json({ preferences: updatedUser.alertPreferences });
  } catch (error) {
    console.error('Failed to update alert preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { familyId, stripeExempt } = await request.json();

    if (!familyId) {
      return NextResponse.json({ error: 'Missing familyId' }, { status: 400 });
    }

    const updatedFamily = await prisma.family.update({
      where: { id: familyId },
      data: { stripeExempt },
    });

    return NextResponse.json({ success: true, family: updatedFamily });
  } catch (error) {
    console.error('Toggle exemption error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

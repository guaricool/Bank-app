import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "Este correo electrónico ya está registrado" }, { status: 409 });
    }

    // Hash password & create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: normalizedEmail,
        passwordHash,
        role: "ADMIN",
      },
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    await setSessionCookie(sessionUser);

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 });
  }
}

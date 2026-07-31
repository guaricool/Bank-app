import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON en la solicitud inválido" }, { status: 400 });
    }

    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    await setSessionCookie(sessionUser);

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error: any) {
    console.error("Login Exception:", error);
    return NextResponse.json({ error: error?.message || "Error al iniciar sesión" }, { status: 500 });
  }
}

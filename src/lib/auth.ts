import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "family-finance-super-secret-key-2026-key";
const COOKIE_NAME = "family_auth_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

/**
 * Sign a lightweight JWT token using Node HMAC SHA-256
 */
export function signJwt(payload: SessionUser): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

/**
 * Verify JWT token signature and return payload
 */
export function verifyJwt(token: string): SessionUser | null {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;

    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null; // Expired
      }
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get current authenticated user from Next.js request cookies
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyJwt(token);
  } catch {
    return null;
  }
}

/**
 * Helper to set session cookie
 */
export async function setSessionCookie(user: SessionUser) {
  const token = signJwt(user);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

/**
 * Helper to clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with bcrypt
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

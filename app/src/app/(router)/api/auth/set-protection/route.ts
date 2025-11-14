// app/api/auth/set-protection/route.ts
import { NextResponse } from 'next/server';

const PROTECTION_COOKIE_NAME = 'api-protection';
const PROTECTION_SECRET = 'super-secure-2025'; 
export async function GET() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: PROTECTION_COOKIE_NAME,
    value: PROTECTION_SECRET,
    httpOnly: true,     // ← JS не может прочитать
    secure: true,       // ← только по HTTPS
    sameSite: 'strict', // ← только с твоего домена
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // год
  });

  return response;
}
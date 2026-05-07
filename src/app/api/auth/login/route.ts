import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, ADMIN_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  const token = await signAdminToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

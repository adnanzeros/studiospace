import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { auth } from '@/lib/auth';

const COOKIE = 'ss_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 din

// POST /api/jwt : valid BetterAuth session thakle HTTPOnly JWT cookie set kore
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, email, name } = session.user;
  const token = jwt.sign({ uid: id, email, name }, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  return res;
}

// DELETE /api/jwt : logout er somoy cookie muche fele
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}

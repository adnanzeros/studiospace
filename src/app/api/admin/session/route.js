import crypto from 'crypto';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const COOKIE = 'ss_admin';
const MAX_AGE = 60 * 60 * 8; // 8 ghonta
const WINDOW = 15 * 60 * 1000; // 15 min e max 5 ti vul try
const attempts = new Map(); // ip -> { count, first }

const hash = s => crypto.createHash('sha256').update(String(s)).digest();

const same = (a, b) =>
  crypto.timingSafeEqual(
    hash(String(a ?? '').trim()),
    hash(String(b ?? '').trim()),
  );

// POST /api/admin/session : { username, password } duto-i thik hole HTTPOnly admin cookie set kore
export async function POST(req) {
  const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'adnanzeros').trim();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim();

  if (!ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return NextResponse.json(
      {
        message:
          'Server env missing: ADMIN_PASSWORD / JWT_SECRET is not set. Add it and restart the server.',
      },
      { status: 500 },
    );
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const now = Date.now();
  let rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW) rec = { count: 0, first: now };
  if (rec.count >= 5) {
    return NextResponse.json(
      { message: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 },
    );
  }

  const { username, password } = await req.json().catch(() => ({}));
  // dutoi check kori (&, short-circuit na) jate kon ta vul bola na jay
  const userOk = same(username, ADMIN_USERNAME);
  const passOk = same(password, ADMIN_PASSWORD);
  if (!(userOk && passOk)) {
    rec.count += 1;
    attempts.set(ip, rec);
    return NextResponse.json(
      { message: 'Wrong admin username or password' },
      { status: 401 },
    );
  }
  attempts.delete(ip);

  const token = jwt.sign(
    { role: 'admin', username: ADMIN_USERNAME },
    process.env.JWT_SECRET,
    {
      expiresIn: MAX_AGE,
    },
  );
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

// DELETE /api/admin/session : admin logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}

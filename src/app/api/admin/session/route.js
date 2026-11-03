import crypto from 'crypto';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const COOKIE = 'ss_admin';
const MAX_AGE = 60 * 60 * 8; 
const WINDOW = 15 * 60 * 1000; 
const attempts = new Map();  

const hash = s => crypto.createHash('sha256').update(String(s)).digest();


export async function POST(req) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: 'Admin password is not configured on the server' },
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

  const { password } = await req.json().catch(() => ({}));
  const ok = crypto.timingSafeEqual(
    hash(password || ''),
    hash(process.env.ADMIN_PASSWORD),
  );
  if (!ok) {
    rec.count += 1;
    attempts.set(ip, rec);
    return NextResponse.json(
      { message: 'Wrong admin password' },
      { status: 401 },
    );
  }
  attempts.delete(ip);

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
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

// DELETE /api/admin/session : admin logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}

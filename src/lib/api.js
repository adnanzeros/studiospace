import { ensureJwt } from './session';

// Server (SSR) e Express er full URL, browser e '/backend' (next.config.mjs rewrite) -> cookie first-party thake
const SERVER = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API = typeof window === 'undefined' ? SERVER : '/backend';

// Image na thakle ei halka gradient dekhabe (broken image icon dekhabe na)
const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4F46E5"/><stop offset="1" stop-color="#EC4899"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>',
  );

// DB te image "/images/studios/xxx.jpg" ba full https URL (imgbb) dui format e thakte pare
export const resolveImage = img => {
  if (!img) return FALLBACK;
  if (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:'))
    return img;
  return `/images/studios/${img}`;
};

// JSON fetch helper: cookie pathay, error hole Error(message) throw kore (err.status soho)
// 401 pele (JWT cookie nai/expired) BetterAuth session theke notun JWT niye ekbar auto-retry kore.
// Session o na thakle tokhon-i 401 throw hoy (tokhon login e pathano thik).
export async function apiFetch(path, options = {}, retried = false) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 && !retried && typeof window !== 'undefined') {
    const refreshed = await ensureJwt(true);
    if (refreshed) return apiFetch(path, options, true);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const err = new Error(data?.message || 'Something went wrong');
    err.status = res.status;
    throw err;
  }
  return data;
}
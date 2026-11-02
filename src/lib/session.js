// BetterAuth session thakle Next route (/api/jwt) HTTPOnly JWT cookie set kore.
// Express server sei cookie verify kore (Challenge 1).
let pending = null;

export function ensureJwt(force = false) {
  if (!pending || force) {
    pending = fetch('/api/jwt', { method: 'POST', credentials: 'include' })
      .then(r => r.ok)
      .catch(() => false);
  }
  return pending;
}

export async function clearJwt() {
  pending = null;
  try {
    await fetch('/api/jwt', { method: 'DELETE', credentials: 'include' });
  } catch {}
}

// "?redirect=" e sudhu nijer site er path allow (open redirect atkate)
export const safeRedirect = value =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/';

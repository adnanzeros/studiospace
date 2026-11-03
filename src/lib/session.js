
let pending = null;

export function ensureJwt(force = false) {
  if (!pending || force) {
    pending = fetch('/api/jwt', { method: 'POST', credentials: 'include' })
      .then(r => {
        if (!r.ok) pending = null; 
        return r.ok;
      })
      .catch(() => {
        pending = null;
        return false;
      });
  }
  return pending;
}

export async function clearJwt() {
  pending = null;
  try {
    await fetch('/api/jwt', { method: 'DELETE', credentials: 'include' });
  } catch {}
}


export const safeRedirect = value =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/';
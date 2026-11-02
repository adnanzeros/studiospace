'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/auth-client';
import { ensureJwt, safeRedirect } from '@/lib/session';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.88-3c-1.07.72-2.45 1.15-4.05 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.28a12 12 0 0 0 0 10.78l4.01-3.1z"
    />
    <path
      fill="#EA4335"
      d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.76 12 4.76z"
    />
  </svg>
);

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));

  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return setError('Please enter a valid email address.');
    if (!form.password) return setError('Please enter your password.');

    setBusy(true);
    const { error: err } = await signIn.email({
      email: form.email,
      password: form.password,
    });
    if (err) {
      setBusy(false);
      const msg = 'Invalid email or password. Please try again.';
      setError(msg);
      return toast.error(msg);
    }
    await ensureJwt(true); // HTTPOnly JWT cookie set
    toast.success('Welcome back! You are logged in.');
    router.replace(redirect);
    router.refresh();
  };

  const google = async () => {
    setError('');
    const { error: err } = await signIn.social({
      provider: 'google',
      callbackURL: redirect,
    });
    if (err) toast.error('Google sign-in failed. Please try again.');
  };

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-card" style={{ margin: '0 auto' }}>
          <h1>Welcome back</h1>
          <p className="auth-sub">
            Log in to book studios and manage your listings.
          </p>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="pw-wrap">
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShow(v => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="button"
                className="link-sm"
                onClick={() =>
                  toast.info(
                    'Password reset is not available yet. Please contact support.',
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: 16 }}
              disabled={busy}
            >
              {busy ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">or</div>
          <button type="button" className="btn btn-google" onClick={google}>
            <GoogleIcon /> Continue with Google
          </button>

          <p className="auth-alt">
            New to StudioSpace? <Link href="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

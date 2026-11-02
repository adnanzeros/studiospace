'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth-client';

// Brief onujayi: Uppercase + Lowercase + minimum 6 character
function passwordError(pw) {
  if (pw.length < 6) return 'Password must be at least 6 characters long.';
  if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter.';
  if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter.';
  return '';
}

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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    photo: '',
    password: '',
  });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const submit = async e => {
    e.preventDefault();
    setFormError('');
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = 'Please enter a valid email address.';
    if (form.photo && !/^https?:\/\/\S+$/i.test(form.photo))
      errs.photo = 'Photo URL must start with http:// or https://';
    const pw = passwordError(form.password);
    if (pw) errs.password = pw;
    setErrors(errs);
    if (Object.keys(errs).length)
      return toast.error(pw || 'Please fix the highlighted fields.');

    setBusy(true);
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
      image: form.photo || undefined,
    });
    setBusy(false);

    if (error) {
      const msg = /exist|already/i.test(error.message || '')
        ? 'An account with this email already exists. Try logging in.'
        : error.message || 'Registration failed. Please try again.';
      setFormError(msg);
      return toast.error(msg);
    }
    toast.success('Account created! Please log in.');
    router.push('/login'); // brief: register hole Login page e
  };

  const google = async () => {
    const { error } = await signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
    if (error) toast.error('Google sign-in failed. Please try again.');
  };

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-card" style={{ margin: '0 auto' }}>
          <h1>Create your account</h1>
          <p className="auth-sub">
            Join StudioSpace to book or host creative studios.
          </p>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                autoComplete="name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Your name"
              />
              {errors.name && <span className="field-err">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="field-err">{errors.email}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="photo">Photo URL</label>
              <input
                id="photo"
                value={form.photo}
                onChange={e => set('photo', e.target.value)}
                placeholder="https://..."
              />
              {errors.photo && (
                <span className="field-err">{errors.photo}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="pw-wrap">
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min 6 chars, upper & lower case"
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
              {errors.password ? (
                <span className="field-err">{errors.password}</span>
              ) : (
                <span className="field-hint">
                  At least 6 characters with one uppercase and one lowercase
                  letter.
                </span>
              )}
            </div>

            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: 16 }}
              disabled={busy}
            >
              {busy ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="divider">or</div>
          <button type="button" className="btn btn-google" onClick={google}>
            <GoogleIcon /> Continue with Google
          </button>

          <p className="auth-alt">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

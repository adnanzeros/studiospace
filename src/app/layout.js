'use client';

import './globals.css';
import './components/ui.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { categories } from '@/lib/assets';
import { signOut, useSession } from '@/lib/auth-client';
import { clearJwt, ensureJwt } from '@/lib/session';

/* ---------- Navbar ---------- */

const links = [
  { href: '/', label: 'Home' },
  { href: '/studios', label: 'Explore Studios' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About Us' },
];

// Brief onujayi dropdown menu + sothik route
const menu = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/add-studio', label: 'Add New Studio' },
  { href: '/my-listings', label: 'My Studio Listings' },
  { href: '/my-bookings', label: 'My Bookings' },
];

function Navbar({ user, theme, onToggleTheme, onLogout }) {
  const path = usePathname();

  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const [pin, setPin] = useState(false); 
  const [scrolled, setScrolled] = useState(false);

  const ddRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onClick = e => {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setDd(false);
        setPin(false);
      }
    };

    window.addEventListener('scroll', onScroll);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setDd(false);
    setPin(false);
  }, [path]);

  const isActive = href => {
    if (href === '/') return path === '/';
    if (href.includes('#')) return false;
    return path === href || path.startsWith(`${href}/`);
  };

  const initial = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo" aria-label="StudioSpace home">
          <img
            src="/logo-light.png"
            alt="StudioSpace"
            className="logo-for-light"
          />
          <img
            src="/logo-dark.png"
            alt="StudioSpace"
            className="logo-for-dark"
          />
        </Link>

        {/* Navigation */}
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className={isActive(link.href) ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <div className="only-mobile">
              <Link href="/login" className="btn btn-outline">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {/* Theme Toggle (Challenge 3) */}
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            type="button"
          >
            {theme === 'dark' ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>

          {/* User Profile */}
          {user ? (
            <div
              className="avatar-wrap"
              ref={ddRef}
              onMouseEnter={() => window.innerWidth > 991 && setDd(true)}
              onMouseLeave={() =>
                window.innerWidth > 991 && !pin && setDd(false)
              }
            >
              <button
                className="avatar"
                onClick={() => {
                  // Hover diye khulle click korle pin hoy, pin kora obosthay click korle bondho hoy
                  if (dd && pin) {
                    setDd(false);
                    setPin(false);
                  } else {
                    setDd(true);
                    setPin(true);
                  }
                }}
                aria-label="Profile menu"
                aria-expanded={dd}
                type="button"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    referrerPolicy="no-referrer"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </button>

              {dd && (
                <div className="dropdown">
                  <div className="dropdown-head">
                    <strong>{user.name}</strong>
                    {user.email && <small>{user.email}</small>}
                  </div>

                  {menu.map(item => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                    </Link>
                  ))}

                  <button className="logout" onClick={onLogout} type="button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-sm btn-login">
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-sm btn-register"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <button
            className={`burger ${open ? 'open' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            type="button"
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Footer ---------- */

const I = ({ d }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

// X (notun logo), purono Twitter bird noy
const socials = [
  {
    n: 'X',
    h: 'https://x.com',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    n: 'Facebook',
    h: 'https://facebook.com',
    d: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z',
  },
  {
    n: 'Instagram',
    h: 'https://instagram.com',
    d: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z',
  },
  {
    n: 'LinkedIn',
    h: 'https://linkedin.com',
    d: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.75 9.75h3.8v1.54h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05V21h-4v-4.9c0-1.17-.02-2.67-1.63-2.67s-1.87 1.27-1.87 2.59V21h-4z',
  },
  {
    n: 'YouTube',
    h: 'https://youtube.com',
    d: 'M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15V9l5.2 3z',
  },
];

function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = e => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error('Please enter a valid email address.');
    }
    toast.success('Subscribed! Check your inbox soon.');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link href="/">
            <img src="/logo-dark.png" alt="StudioSpace" />
          </Link>
          <p>
            Our mission is to make every creative space accessible, so
            filmmakers, photographers, podcasters and musicians can focus on
            making great work.
          </p>
          <div className="socials">
            {socials.map(social => (
              <a
                key={social.n}
                href={social.h}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.n}
              >
                <I d={social.d} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/studios">Explore Studios</Link>
            </li>
            <li>
              <Link href="/how-it-works">How It Works</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/add-studio">Host Your Space</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Categories: slug use kora hoyeche, tai /studios e category pre-select hobe */}
        <div>
          <h4>Popular Categories</h4>
          <ul>
            {categories.map(cat => (
              <li key={cat.slug}>
                <Link href={`/studios?category=${cat.slug}`}>{cat.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4>Newsletter</h4>
          <p className="nl-text">
            Get new studio listings and booking tips in your inbox every week.
          </p>
          <form className="nl-form" onSubmit={subscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Email address"
              required
            />
            <button className="btn btn-primary btn-sm" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} StudioSpace. All rights reserved.
        </span>
        <span>
          By using StudioSpace you agree to our{' '}
          <Link href="/terms">Terms of Service</Link> and{' '}
          <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </div>
    </footer>
  );
}

/* ---------- Root Layout ---------- */

export default function RootLayout({ children }) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user || null;

  const [theme, setTheme] = useState('light');

  // Saved theme load
  useEffect(() => {
    let saved = 'light';
    try {
      saved = localStorage.getItem('ss_theme') || 'light';
    } catch {}
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('ss_theme', next);
    } catch {}
  };

  // Login thakle (reload dileo) HTTPOnly JWT cookie refresh hoy
  useEffect(() => {
    if (user) ensureJwt();
  }, [user?.id]);

  const logout = async () => {
    try {
      await signOut();
      await clearJwt();
      toast.success('You have been logged out.');
      router.push('/');
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>StudioSpace | Book Creative Studios by the Hour</title>
        <meta
          name="description"
          content="Peer-to-peer creative workspaces: photo studios, sound stages, podcast rooms and more."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16.png"
        />
        <link rel="apple-touch-icon" href="/logo-icon-512.png" />

        {/* Theme init: page load e flash ray na */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem('ss_theme')||'light'}catch(e){}`,
          }}
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <Navbar
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={logout}
        />

        <main>{children}</main>

        <Footer />

        <Toaster
          position="top-right"
          theme={theme}
          richColors
          closeButton
          offset={92}
        />
      </body>
    </html>
  );
}

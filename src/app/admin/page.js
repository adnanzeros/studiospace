'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Building2,
  CalendarCheck,
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  LogOut,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import { apiFetch, resolveImage } from '@/lib/api';
import { categoryLabel } from '@/lib/categories';

const ADMIN_USERNAME = 'adnanzeros';

const CSS = `
/* ===== Layout ===== */
.ad-wrap { padding: 40px 0 72px; position: relative; }

/* ===== Login ===== */
.ad-login-stage { position: relative; display: flex; justify-content: center; padding: 24px 0 8px; }
.ad-login-stage::before,
.ad-login-stage::after { content: ''; position: absolute; width: 320px; height: 320px; border-radius: 50%; filter: blur(80px); opacity: .35; pointer-events: none; z-index: 0; animation: adFloat 9s ease-in-out infinite alternate; }
.ad-login-stage::before { background: #6366F1; top: -40px; left: 8%; }
.ad-login-stage::after { background: #EC4899; bottom: -60px; right: 8%; animation-delay: -4s; }
@keyframes adFloat { to { transform: translate(30px, -24px) scale(1.12); } }

.ad-login { position: relative; z-index: 1; width: 100%; max-width: 430px; padding: 38px 32px 32px; background: var(--surface); border: 1px solid var(--border); border-radius: 28px; box-shadow: var(--shadow-card), 0 30px 60px -30px rgba(147, 51, 234, .35); text-align: center; animation: adRise .6s cubic-bezier(.2, .8, .2, 1) both; }
@keyframes adRise { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: none; } }
.ad-login-badge { width: 68px; height: 68px; margin: 0 auto 16px; display: grid; place-items: center; border-radius: 22px; color: #fff; background-image: var(--grad-brand); box-shadow: var(--shadow-glow); animation: adPulse 3.2s ease-in-out infinite; }
.ad-login-badge svg { color: #fff; margin: 0; }
@keyframes adPulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
.ad-login h1 { font-size: 28px; margin: 0 0 6px; background-image: var(--grad-text); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ad-login > p { color: var(--muted); margin: 0 0 24px; font-size: 14px; }

/* gradient border input + hover animation */
.ad-field { position: relative; margin-bottom: 14px; text-align: left; }
.ad-field input { width: 100%; height: 54px; padding: 0 50px 0 48px; border: 2px solid transparent; border-radius: 16px; outline: none; color: var(--text); font-size: 15px;
  background-image: linear-gradient(var(--surface), var(--surface)), linear-gradient(90deg, #6366F1, #A855F7, #EC4899, #6366F1);
  background-origin: border-box; background-clip: padding-box, border-box; background-size: 100% 100%, 300% 100%; background-position: 0 0, 0% 0;
  transition: background-position .7s ease, box-shadow .3s ease, transform .3s ease; }
.ad-field input::placeholder { color: var(--muted); opacity: .85; }
.ad-field input:hover { background-position: 0 0, 100% 0; transform: translateY(-2px); box-shadow: 0 12px 24px -12px rgba(147, 51, 234, .55); }
.ad-field input:focus { transform: translateY(-2px); box-shadow: 0 0 0 4px rgba(168, 85, 247, .16), 0 14px 28px -12px rgba(147, 51, 234, .6); animation: adFlow 2.6s linear infinite alternate; }
@keyframes adFlow { to { background-position: 0 0, 100% 0; } }
.ad-field input:-webkit-autofill { -webkit-text-fill-color: var(--text); box-shadow: 0 0 0 100px var(--surface) inset; }
.ad-ico { z-index: 2; position: absolute; left: 16px; top: 50%; transform: translateY(-50%); display: grid; place-items: center; color: var(--muted); pointer-events: none; transition: color .25s, transform .25s; }
.ad-ico svg { margin: 0; }
.ad-field:hover .ad-ico, .ad-field:focus-within .ad-ico { color: #A855F7; transform: translateY(-50%) scale(1.12); }
.ad-eye { z-index: 2; position: absolute; right: 9px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 12px; background: transparent; color: var(--muted); cursor: pointer; transition: background .2s, color .2s, transform .2s; }
.ad-eye:hover { background-image: var(--grad-brand-soft); color: #A855F7; transform: translateY(-50%) scale(1.08); }
.ad-eye:active { transform: translateY(-50%) scale(.94); }
.ad-eye svg { margin: 0; }

.ad-submit { width: 100%; height: 52px; margin-top: 8px; border: 0; border-radius: 16px; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background-image: linear-gradient(90deg, #4F46E5, #9333EA, #EC4899, #4F46E5); background-size: 300% 100%; background-position: 0 0; box-shadow: var(--shadow-glow); transition: background-position .6s ease, transform .25s ease, box-shadow .25s ease; }
.ad-submit:hover:not(:disabled) { background-position: 100% 0; transform: translateY(-2px); }
.ad-submit:active:not(:disabled) { transform: translateY(0) scale(.99); }
.ad-submit:disabled { opacity: .65; cursor: progress; }
.ad-submit svg { margin: 0; color: #fff; }
.ad-hint { margin-top: 18px; font-size: 12.5px; color: var(--muted); }

/* ===== Panel header + tabs ===== */
.ad-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 22px; }
.ad-head h1 { font-size: 32px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ad-user-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; color: #7C3AED; background-image: var(--grad-brand-soft); border: 1px solid var(--border); }
.ad-tabs { display: flex; gap: 6px; flex-wrap: wrap; padding: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; width: fit-content; max-width: 100%; margin-bottom: 26px; box-shadow: var(--shadow-card); }
.ad-tab { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border: 0; border-radius: 999px; background: none; color: var(--muted); font-weight: 600; cursor: pointer; transition: color .2s, background .2s, transform .2s; }
.ad-tab:hover { color: var(--text); background-image: var(--grad-brand-soft); }
.ad-tab.active { background-image: var(--grad-brand); color: #fff; box-shadow: var(--shadow-glow); }
.ad-tab.active:hover { transform: translateY(-1px); }

/* ===== Stats ===== */
.ad-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 20px; }
.ad-stat { position: relative; overflow: hidden; padding: 22px; background: var(--surface); border: 1px solid var(--border); border-radius: 22px; transition: transform .25s, box-shadow .25s; animation: adRise .5s both; }
.ad-stat::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 4px; background-image: var(--grad-brand); }
.ad-stat:hover { transform: translateY(-4px); box-shadow: var(--shadow-card); }
.ad-stat small { color: var(--muted); display: block; margin-bottom: 8px; font-weight: 500; }
.ad-stat strong { font-size: 32px; background-image: var(--grad-text); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ad-status-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }

/* ===== Toolbar + tables ===== */
.ad-bar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.ad-bar input, .ad-bar select { min-width: 240px; height: 46px; padding: 0 16px; border-radius: 14px; border: 2px solid transparent; outline: none; color: var(--text);
  background-image: linear-gradient(var(--surface), var(--surface)), linear-gradient(90deg, #6366F1, #A855F7, #EC4899, #6366F1);
  background-origin: border-box; background-clip: padding-box, border-box; background-size: 100% 100%, 300% 100%; background-position: 0 0, 0% 0; transition: background-position .7s, box-shadow .3s; }
.ad-bar input:hover, .ad-bar select:hover, .ad-bar input:focus, .ad-bar select:focus { background-position: 0 0, 100% 0; box-shadow: 0 10px 22px -12px rgba(147, 51, 234, .55); }
.ad-count { color: var(--muted); font-size: 14px; margin-bottom: 10px; }
.ad-table-wrap { overflow-x: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 22px; box-shadow: var(--shadow-card); }
.ad-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ad-table th, .ad-table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; }
.ad-table th { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .05em; background-image: var(--grad-brand-soft); }
.ad-table tbody tr { transition: background .2s; }
.ad-table tbody tr:hover { background-image: var(--grad-card-glow); }
.ad-table tr:last-child td { border-bottom: 0; }
.ad-thumb { width: 56px; height: 40px; object-fit: cover; border-radius: 10px; vertical-align: middle; margin-right: 10px; }
.ad-actions { display: flex; gap: 6px; }

@media (max-width: 560px) {
  .ad-login { padding: 30px 20px 24px; border-radius: 22px; }
  .ad-head h1 { font-size: 26px; }
  .ad-bar input, .ad-bar select { min-width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .ad-login, .ad-login-badge, .ad-stat, .ad-login-stage::before, .ad-login-stage::after, .ad-field input:focus { animation: none; }
  .ad-field input, .ad-submit, .ad-tab, .ad-stat { transition: none; }
}
`;

const fmt = d => (d ? new Date(d).toLocaleDateString() : '-');
const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const NEXT = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Completed', 'Cancelled'],
};

/* ---------------- Login ---------------- */
function AdminLogin({ onDone }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!username.trim())
      return toast.error('Please enter the admin username.');
    if (username.trim() !== ADMIN_USERNAME)
      return toast.error('Wrong admin username.');
    if (!password) return toast.error('Please enter the admin password.');
    setBusy(true);
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Login failed');
      toast.success('Welcome back, admin!');
      onDone();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ad-login-stage">
      <form className="ad-login" onSubmit={submit} noValidate>
        <div className="ad-login-badge">
          <ShieldCheck size={32} />
        </div>
        <h1>Admin Access</h1>
        <p>Sign in to manage studios, bookings and users.</p>

        <div className="ad-field">
          <span className="ad-ico">
            <User size={18} />
          </span>
          <input
            type="text"
            placeholder="Admin username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="off"
            autoFocus
            aria-label="Admin username"
          />
        </div>

        <div className="ad-field">
          <span className="ad-ico">
            <Lock size={18} />
          </span>
          <input
            type={show ? 'text' : 'password'}
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-label="Admin password"
          />
          <button
            type="button"
            className="ad-eye"
            onClick={() => setShow(v => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
            title={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button type="submit" className="ad-submit" disabled={busy}>
          <Lock size={16} /> {busy ? 'Checking...' : 'Enter Admin Panel'}
        </button>
        <div className="ad-hint">Restricted area. Authorized admins only.</div>
      </form>
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview({ req }) {
  const [s, setS] = useState(null);
  useEffect(() => {
    req('/api/admin/stats')
      .then(setS)
      .catch(e => toast.error(e.message));
  }, [req]);
  if (!s) return <Spinner label="Loading overview..." />;

  const cards = [
    ['Total users', s.users],
    ['Total studios', s.studios],
    ['Total bookings', s.bookings],
    ['Revenue (confirmed + completed)', `$${s.revenue}`],
  ];
  return (
    <>
      <div className="ad-stats">
        {cards.map(([label, value]) => (
          <div key={label} className="ad-stat">
            <small>{label}</small>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="ad-stat">
        <small>Bookings by status</small>
        <div className="ad-status-row" style={{ marginTop: 10 }}>
          {STATUSES.map(st => (
            <span key={st} className={`badge badge-${st.toLowerCase()}`}>
              {st}: {s.statuses[st]}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- Studios ---------------- */
function StudiosTab({ req }) {
  const [list, setList] = useState(null);
  const [q, setQ] = useState('');
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    req('/api/admin/studios')
      .then(setList)
      .catch(e => {
        setList([]);
        toast.error(e.message);
      });
  }, [req]);

  const remove = async () => {
    setBusy(true);
    try {
      await req(`/api/admin/studios/${target._id}`, { method: 'DELETE' });
      setList(l => l.filter(s => s._id !== target._id));
      toast.success('Studio deleted.');
      setTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!list) return <Spinner label="Loading studios..." />;
  const shown = list.filter(s =>
    `${s.title} ${s.ownerEmail} ${s.location}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );

  return (
    <>
      <div className="ad-bar">
        <input
          placeholder="Search title, host or location"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <p className="ad-count">{shown.length} studios</p>
      {shown.length === 0 ? (
        <div className="empty">
          <h3>No studios found</h3>
          <p>Try a different search.</p>
        </div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Host</th>
                <th>Rating</th>
                <th>Listed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(s => (
                <tr key={s._id}>
                  <td>
                    <img
                      className="ad-thumb"
                      src={resolveImage(s.image)}
                      alt=""
                    />
                    {s.title}
                  </td>
                  <td>{categoryLabel(s.category)}</td>
                  <td>${s.hourlyRate}/hr</td>
                  <td>
                    {s.ownerName}
                    <br />
                    <small>{s.ownerEmail}</small>
                  </td>
                  <td>
                    {Number(s.rating || 0).toFixed(1)} ({s.reviewsCount || 0})
                  </td>
                  <td>{fmt(s.createdAt)}</td>
                  <td>
                    <button
                      className="btn-ghost-sm danger"
                      onClick={() => setTarget(s)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {target && (
        <ConfirmModal
          title="Delete this studio?"
          message={`"${target.title}" will be removed permanently and its pending bookings will be cancelled.`}
          confirmLabel="Delete studio"
          danger
          busy={busy}
          onConfirm={remove}
          onClose={() => setTarget(null)}
        />
      )}
    </>
  );
}

/* ---------------- Bookings ---------------- */
function BookingsTab({ req }) {
  const [list, setList] = useState(null);
  const [filter, setFilter] = useState('All');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    req('/api/admin/bookings')
      .then(setList)
      .catch(e => {
        setList([]);
        toast.error(e.message);
      });
  }, [req]);

  const change = async (b, status) => {
    setBusyId(b._id);
    try {
      const updated = await req(`/api/admin/bookings/${b._id}/status`, {
        method: 'PATCH',
        body: { status },
      });
      setList(l => l.map(x => (x._id === b._id ? updated : x)));
      toast.success(`Booking marked ${status.toLowerCase()}.`);
    } catch (e) {
      toast.error(e.message); // 409 overlap message ekhane ashbe
    } finally {
      setBusyId(null);
    }
  };

  if (!list) return <Spinner label="Loading bookings..." />;
  const shown = filter === 'All' ? list : list.filter(b => b.status === filter);

  return (
    <>
      <div className="ad-bar">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          {STATUSES.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <p className="ad-count">{shown.length} bookings</p>
      {shown.length === 0 ? (
        <div className="empty">
          <h3>No bookings found</h3>
          <p>Bookings will appear here once guests start reserving.</p>
        </div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Guest</th>
                <th>Date & time</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(b => (
                <tr key={b._id}>
                  <td>
                    {b.studioTitle}
                    <br />
                    <small>Host: {b.ownerEmail}</small>
                  </td>
                  <td>
                    {b.userName}
                    <br />
                    <small>{b.userEmail}</small>
                  </td>
                  <td>
                    {b.date}
                    <br />
                    <small>
                      {b.startTime} - {b.endTime} ({b.hours}h)
                    </small>
                  </td>
                  <td>${b.total}</td>
                  <td>
                    <span className={`badge badge-${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="ad-actions">
                      {(NEXT[b.status] || []).map(st => (
                        <button
                          key={st}
                          className={`btn-ghost-sm ${st === 'Cancelled' ? 'danger' : 'ok'}`}
                          disabled={busyId === b._id}
                          onClick={() => change(b, st)}
                        >
                          {st === 'Cancelled'
                            ? 'Cancel'
                            : st === 'Confirmed'
                              ? 'Confirm'
                              : 'Complete'}
                        </button>
                      ))}
                      {!NEXT[b.status] && <small>-</small>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ---------------- Users ---------------- */
function UsersTab({ req }) {
  const [list, setList] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    req('/api/admin/users')
      .then(setList)
      .catch(e => {
        setList([]);
        toast.error(e.message);
      });
  }, [req]);

  if (!list) return <Spinner label="Loading users..." />;
  const shown = list.filter(u =>
    `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <div className="ad-bar">
        <input
          placeholder="Search name or email"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <p className="ad-count">{shown.length} users</p>
      {shown.length === 0 ? (
        <div className="empty">
          <h3>No users found</h3>
          <p>Try a different search.</p>
        </div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(u => (
                <tr key={String(u._id)}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{fmt(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ---------------- Page ---------------- */
const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'studios', label: 'Studios', icon: Building2 },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'users', label: 'Users', icon: Users },
];

export default function AdminPage() {
  const [auth, setAuth] = useState('checking'); // checking | in | out
  const [tab, setTab] = useState('overview');

  // Admin API call: 401 pele (session sesh) login screen e fire jay. 3rd arg true = user-JWT auto retry off
  const req = useCallback(async (path, opts) => {
    try {
      return await apiFetch(path, opts, true);
    } catch (e) {
      if (e.status === 401) setAuth('out');
      throw e;
    }
  }, []);

  useEffect(() => {
    apiFetch('/api/admin/me', {}, true)
      .then(() => setAuth('in'))
      .catch(() => setAuth('out'));
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/admin/session', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch {}
    setAuth('out');
    toast.success('Logged out of admin panel.');
  };

  if (auth === 'checking') return <Spinner label="Checking admin access..." />;

  return (
    <section className="ad-wrap container">
      <title>Admin | StudioSpace</title>
      <meta name="robots" content="noindex, nofollow" />
      <style>{CSS}</style>
      {auth === 'out' ? (
        <AdminLogin
          onDone={() => {
            setTab('overview');
            setAuth('in');
          }}
        />
      ) : (
        <>
          <div className="ad-head">
            <h1>
              Admin Panel
              <span className="ad-user-chip">
                <User size={13} /> @{ADMIN_USERNAME}
              </span>
            </h1>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
          <div className="ad-tabs">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`ad-tab ${tab === id ? 'active' : ''}`}
                onClick={() => setTab(id)}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          {tab === 'overview' && <Overview req={req} />}
          {tab === 'studios' && <StudiosTab req={req} />}
          {tab === 'bookings' && <BookingsTab req={req} />}
          {tab === 'users' && <UsersTab req={req} />}
        </>
      )}
    </section>
  );
}

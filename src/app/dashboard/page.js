'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Heart, Inbox, Store } from 'lucide-react';
import PrivateRoute from '../components/PrivateRoute';
import Spinner from '../components/Spinner';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

function Dashboard() {
  const { data } = useSession();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/studios/mine'),
      apiFetch('/api/bookings/mine'),
      apiFetch('/api/bookings/host'),
      apiFetch('/api/wishlist'),
    ])
      .then(([listings, mine, host, saved]) =>
        setStats({
          listings: listings.length,
          bookings: mine.length,
          requests: host.filter(b => b.status === 'Pending').length,
          saved: saved.length,
        }),
      )
      .catch(() =>
        setStats({ listings: 0, bookings: 0, requests: 0, saved: 0 }),
      );
  }, []);

  if (!stats) return <Spinner label="Loading your dashboard..." />;

  const cards = [
    { label: 'Studios listed', value: stats.listings, icon: Store },
    { label: 'My bookings', value: stats.bookings, icon: CalendarCheck },
    { label: 'Pending host requests', value: stats.requests, icon: Inbox },
    { label: 'Saved studios', value: stats.saved, icon: Heart },
  ];

  return (
    <section className="pg">
      <div className="container">
        <div className="pg-head">
          <div>
            <h1>Hi, {data?.user?.name?.split(' ')[0] || 'creator'}</h1>
            <p>Here is a quick look at your StudioSpace activity.</p>
          </div>
        </div>

        <div className="stat-grid">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="stat">
              <div className="stat-icon">
                <Icon size={20} />
              </div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="quick-grid">
          <Link href="/add-studio" className="quick">
            <h3>Add New Studio</h3>
            <p>List a new creative space and start earning.</p>
          </Link>
          <Link href="/my-listings" className="quick">
            <h3>My Studio Listings</h3>
            <p>Update details or remove a listing.</p>
          </Link>
          <Link href="/my-bookings" className="quick">
            <h3>My Bookings</h3>
            <p>Track reservations and confirm host requests.</p>
          </Link>
          <Link href="/wishlist" className="quick">
            <h3>Saved Studios</h3>
            <p>Revisit the spaces you hearted.</p>
          </Link>
          <Link href="/studios" className="quick">
            <h3>Explore Studios</h3>
            <p>Find your next shoot location.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}

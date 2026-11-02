'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { CalendarDays, Clock, Download, MapPin } from 'lucide-react';
import PrivateRoute from '../components/PrivateRoute';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';
import { apiFetch, resolveImage } from '@/lib/api';
import { downloadInvoice } from '@/lib/invoice';

const Badge = ({ status }) => (
  <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
);

function BookingCard({ b, host, onCancel, onStatus, busyId }) {
  const working = busyId === b._id;
  const canInvoice = b.status === 'Confirmed' || b.status === 'Completed';

  return (
    <article className="bk-card">
      <div className="bk-img">
        <img src={resolveImage(b.studioImage)} alt={b.studioTitle} />
      </div>

      <div className="bk-body">
        <h3>
          <Link href={`/studios/${b.studioId}`}>{b.studioTitle}</Link>
        </h3>
        <div className="bk-meta">
          <span>
            <CalendarDays size={15} /> {b.date}
          </span>
          <span>
            <Clock size={15} /> {b.startTime} - {b.endTime} ({b.hours}h)
          </span>
          <span>
            <MapPin size={15} /> {b.studioLocation}
          </span>
        </div>
        <div className="bk-meta" style={{ marginTop: 6 }}>
          {host ? (
            <span>
              Guest: {b.userName} ({b.userEmail})
            </span>
          ) : (
            <span>Host: {b.ownerName}</span>
          )}
        </div>
        {b.notes && <p className="bk-note">&ldquo;{b.notes}&rdquo;</p>}
      </div>

      <div className="bk-side">
        <Badge status={b.status} />
        <span className="bk-price">${b.total}</span>
        <div className="row-actions">
          {canInvoice && (
            <button className="btn-ghost-sm" onClick={() => downloadInvoice(b)}>
              <Download size={14} /> Invoice
            </button>
          )}

          {!host && b.status === 'Pending' && (
            <button
              className="btn-ghost-sm danger"
              disabled={working}
              onClick={() => onCancel(b)}
            >
              Cancel Booking
            </button>
          )}

          {host && b.status === 'Pending' && (
            <>
              <button
                className="btn-ghost-sm ok"
                disabled={working}
                onClick={() => onStatus(b, 'Confirmed')}
              >
                Confirm
              </button>
              <button
                className="btn-ghost-sm danger"
                disabled={working}
                onClick={() => onStatus(b, 'Cancelled')}
              >
                Decline
              </button>
            </>
          )}
          {host && b.status === 'Confirmed' && (
            <>
              <button
                className="btn-ghost-sm ok"
                disabled={working}
                onClick={() => onStatus(b, 'Completed')}
              >
                Mark Completed
              </button>
              <button
                className="btn-ghost-sm danger"
                disabled={working}
                onClick={() => onStatus(b, 'Cancelled')}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function MyBookings() {
  const [tab, setTab] = useState('mine');
  const [mine, setMine] = useState(null);
  const [hostList, setHostList] = useState(null);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [m, h] = await Promise.all([
        apiFetch('/api/bookings/mine'),
        apiFetch('/api/bookings/host'),
      ]);
      setMine(m);
      setHostList(h);
    } catch (err) {
      setError(true);
      toast.error(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replace = updated => {
    const swap = list => list.map(x => (x._id === updated._id ? updated : x));
    setMine(l => l && swap(l));
    setHostList(l => l && swap(l));
  };

  const cancel = async () => {
    setBusyId(target._id);
    try {
      replace(
        await apiFetch(`/api/bookings/${target._id}/cancel`, {
          method: 'PATCH',
        }),
      );
      toast.success('Booking cancelled.');
      setTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const setStatus = async (b, status) => {
    setBusyId(b._id);
    try {
      replace(
        await apiFetch(`/api/bookings/${b._id}/status`, {
          method: 'PATCH',
          body: { status },
        }),
      );
      toast.success(`Booking ${status.toLowerCase()}.`);
    } catch (err) {
      toast.error(err.message); // overlap hole 409 message ekhane
    } finally {
      setBusyId(null);
    }
  };

  if (!mine && !error) return <Spinner label="Loading your bookings..." />;

  const list = tab === 'mine' ? mine : hostList;
  const pendingRequests = (hostList || []).filter(
    b => b.status === 'Pending',
  ).length;

  return (
    <section className="pg">
      <div className="container">
        <div className="pg-head">
          <div>
            <h1>My Bookings</h1>
            <p>Track your reservations and manage requests for your studios.</p>
          </div>
        </div>

        <div className="tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'mine'}
            className={`tab ${tab === 'mine' ? 'active' : ''}`}
            onClick={() => setTab('mine')}
          >
            My Reservations
          </button>
          <button
            role="tab"
            aria-selected={tab === 'host'}
            className={`tab ${tab === 'host' ? 'active' : ''}`}
            onClick={() => setTab('host')}
          >
            Host Requests{pendingRequests ? ` (${pendingRequests})` : ''}
          </button>
        </div>

        {error && (
          <div className="empty">
            <h3>We couldn&apos;t load your bookings</h3>
            <p>Please refresh the page or log in again.</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {list && list.length === 0 && (
          <div className="empty">
            <CalendarDays size={36} />
            <h3>
              {tab === 'mine' ? 'No bookings yet' : 'No booking requests yet'}
            </h3>
            <p>
              {tab === 'mine'
                ? 'Find a studio that fits your next shoot and reserve your slot in minutes.'
                : 'When creators book your studios, their requests will show up here.'}
            </p>
            <Link
              href={tab === 'mine' ? '/studios' : '/add-studio'}
              className="btn btn-primary"
            >
              {tab === 'mine' ? 'Explore Studios' : 'Host Your Space'}
            </Link>
          </div>
        )}

        {list && list.length > 0 && (
          <div className="bk-list">
            {list.map(b => (
              <BookingCard
                key={b._id}
                b={b}
                host={tab === 'host'}
                busyId={busyId}
                onCancel={setTarget}
                onStatus={setStatus}
              />
            ))}
          </div>
        )}
      </div>

      {target && (
        <ConfirmModal
          danger
          busy={busyId === target._id}
          title="Cancel this booking?"
          message={`Your pending request for "${target.studioTitle}" on ${target.date} will be cancelled.`}
          confirmLabel="Yes, cancel booking"
          cancelLabel="Keep booking"
          onConfirm={cancel}
          onClose={() => setTarget(null)}
        />
      )}
    </section>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookings />
    </PrivateRoute>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Modal from './Modal';
import { apiFetch } from '@/lib/api';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const TIMES = Array.from(
  { length: 18 },
  (_, i) => `${String(i + 6).padStart(2, '0')}:00`,
); // 06:00 - 23:00

// Ajker date hole shudhu ekhon er por er ghonta gulo dekhabe (past somoy hide)
const timesFor = d =>
  d === todayStr()
    ? TIMES.filter(t => Number(t.slice(0, 2)) > new Date().getHours())
    : TIMES;

// "Book Workspace Now" click korle ei modal khole
export default function BookingModal({ studio, onClose }) {
  const router = useRouter();
  const [date, setDate] = useState(todayStr());
  const [startTime, setStartTime] = useState(
    () => timesFor(todayStr())[0] || TIMES[0],
  );
  const [hours, setHours] = useState(2);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const times = timesFor(date);

  const onDateChange = value => {
    setDate(value);
    const list = timesFor(value);
    if (!list.includes(startTime)) setStartTime(list[0] || TIMES[0]);
  };

  const total = useMemo(
    () => studio.hourlyRate * hours,
    [studio.hourlyRate, hours],
  );

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!date) return setError('Please choose a date.');
    setBusy(true);
    try {
      await apiFetch('/api/bookings', {
        method: 'POST',
        body: {
          studioId: String(studio._id),
          date,
          startTime,
          hours: Number(hours),
          notes,
        },
      });
      toast.success('Booking request sent! The host will confirm it soon.');
      onClose();
      router.push('/my-bookings');
    } catch (err) {
      if (err.status === 401) {
        toast.error('Your session expired. Please log in again.');
        router.push(`/login?redirect=/studios/${studio._id}`);
      } else {
        setError(err.message); // 409 overlap message ekhane dekhabe
        toast.error(
          err.status === 409
            ? 'That time slot is already booked.'
            : err.message,
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title="Book this workspace"
      onClose={busy ? undefined : onClose}
      wide
    >
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="bk-date">Date</label>
            <input
              id="bk-date"
              type="date"
              min={todayStr()}
              value={date}
              onChange={e => onDateChange(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="bk-time">Start time</label>
            <select
              id="bk-time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            >
              {times.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="bk-hours">Duration</label>
            <select
              id="bk-hours"
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                <option key={h} value={h}>
                  {h} {h === 1 ? 'hour' : 'hours'}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="bk-studio">Studio</label>
            <input id="bk-studio" value={studio.title} readOnly />
          </div>
          <div className="field full">
            <label htmlFor="bk-notes">Notes for the host (optional)</label>
            <textarea
              id="bk-notes"
              style={{ minHeight: 80 }}
              maxLength={300}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Crew size, gear you are bringing, special requests..."
            />
          </div>
        </div>

        <div className="book-summary">
          <div>
            <span>
              ${studio.hourlyRate} x {hours} {hours === 1 ? 'hour' : 'hours'}
            </span>
            <span>${total}</span>
          </div>
          <div>
            <span>Refundable security deposit</span>
            <span>${studio.securityDeposit}</span>
          </div>
          <div className="total">
            <span>Studio total</span>
            <span>${total}</span>
          </div>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Sending...' : 'Confirm Booking Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

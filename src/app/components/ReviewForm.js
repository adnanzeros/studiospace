'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { apiFetch } from '@/lib/api';

// Studio details page-er Reviews section er niche boshe. Success hole updated studio onAdded() e pathay.
export default function ReviewForm({ studio, user, onAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const box = {
    marginTop: 20,
    padding: 18,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
  };

  if (!user) {
    return (
      <p className="dt-text" style={{ marginTop: 16 }}>
        <Link href={`/login?redirect=/studios/${studio._id}`}>Log in</Link> to
        leave a review.
      </p>
    );
  }
  if (user.email === studio.ownerEmail) return null;
  if (studio.reviews?.some(r => r.userId === user.id)) return null; // already reviewed

  const submit = async e => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      return toast.error('Please write at least 5 characters.');
    }
    setBusy(true);
    try {
      const updated = await apiFetch(`/api/studios/${studio._id}/reviews`, {
        method: 'POST',
        body: { rating, comment },
      });
      onAdded(updated);
      toast.success('Thanks! Your review has been added.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={box} noValidate>
      <strong>Rate your experience</strong>
      <div style={{ display: 'flex', gap: 4, margin: '10px 0' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            style={{
              background: 'none',
              border: 0,
              cursor: 'pointer',
              color: '#f59e0b',
            }}
          >
            <Star size={24} fill={n <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        maxLength={500}
        placeholder="How was the space, lighting, sound and host?"
        style={{ width: '100%', minHeight: 90, marginBottom: 12 }}
      />
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? 'Posting...' : 'Post Review'}
      </button>
    </form>
  );
}

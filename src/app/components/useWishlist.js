'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { ensureJwt } from '@/lib/session';

// Wishlist (optional requirement). User nijei session theke ashe, parameter lagbe na.
export default function useWishlist() {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user || null;

  const [saved, setSaved] = useState(new Set());
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!user) {
      setSaved(new Set());
      return;
    }
    let alive = true;
    ensureJwt()
      .then(() => apiFetch('/api/wishlist'))
      .then(ids => alive && setSaved(new Set(ids.map(String))))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [user?.id]);

  const toggle = useCallback(
    async rawId => {
      const id = String(rawId);
      if (!user) {
        toast.info('Please log in to save studios to your wishlist.');
        router.push('/login');
        return;
      }
      const before = saved;
      const wasSaved = before.has(id);
      const next = new Set(before);
      if (wasSaved) next.delete(id);
      else next.add(id);
      setSaved(next); // optimistic
      setBusyId(rawId);

      try {
        await apiFetch(`/api/wishlist/${id}`, {
          method: wasSaved ? 'DELETE' : 'POST',
        });
        toast.success(
          wasSaved ? 'Removed from wishlist' : 'Saved to your wishlist',
        );
      } catch (err) {
        setSaved(before); // rollback
        toast.error(err.message || 'Something went wrong. Please try again.');
      } finally {
        setBusyId(null);
      }
    },
    [user, saved, router],
  );

  return { saved, busyId, toggle };
}

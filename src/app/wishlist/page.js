'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import PrivateRoute from '../components/PrivateRoute';
import Spinner from '../components/Spinner';
import StudioCard from '../components/StudioCard';
import useWishlist from '../components/useWishlist';
import { apiFetch } from '@/lib/api';
import '../components/featured-studios.css';

function Saved() {
  const [list, setList] = useState(null);
  const { saved, busyId, toggle } = useWishlist();

  useEffect(() => {
    apiFetch('/api/wishlist/studios')
      .then(setList)
      .catch(err => {
        setList([]);
        toast.error(err.message);
      });
  }, []);

  if (!list) return <Spinner label="Loading saved studios..." />;

  // heart off korle list theke sorbe
  const visible = list.filter(
    s => saved.has(String(s._id)) || String(busyId) === String(s._id),
  );

  return (
    <section className="pg">
      <div className="container">
        <div className="pg-head">
          <div>
            <h1>Saved Studios</h1>
            <p>Your wishlist of favorite creative spaces.</p>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="empty">
            <Heart size={36} />
            <h3>No saved studios yet</h3>
            <p>Tap the heart on any studio card to save it here for later.</p>
            <Link href="/studios" className="btn btn-primary">
              Explore Studios
            </Link>
          </div>
        ) : (
          <div className="fs-grid">
            {visible.map(s => (
              <StudioCard
                key={s._id}
                studio={s}
                saved={saved.has(String(s._id))}
                busy={String(busyId) === String(s._id)}
                onToggle={toggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function WishlistPage() {
  return (
    <PrivateRoute>
      <Saved />
    </PrivateRoute>
  );
}

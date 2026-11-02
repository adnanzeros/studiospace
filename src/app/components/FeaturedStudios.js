'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import StudioCard from './StudioCard';
import useWishlist from './useWishlist';

// studios Home page.js theke server-side fetch hoye ashe (MongoDB, .limit(6))
export default function FeaturedStudios({ studios = [], error = false }) {
  const { saved, busyId, toggle } = useWishlist();

  return (
    <section className="fs-section" id="featured-studios">
      <div className="container">
        <div className="fs-head">
          <span className="fs-eyebrow text-gradient">Featured Studios</span>
          <h2 className="fs-title">Top-rated spaces, ready to book</h2>
          <p className="fs-sub">
            Hand-picked studios loved by photographers, filmmakers, podcasters
            and musicians.
          </p>
        </div>

        <div className="fs-grid">
          {error && (
            <div className="fs-state">
              <h3>We couldn&apos;t load the studios</h3>
              <p>Please refresh the page or try again in a moment.</p>
            </div>
          )}

          {!error && studios.length === 0 && (
            <div className="fs-state">
              <h3>No studios listed yet</h3>
              <p>Be the first host to list a creative space on StudioSpace.</p>
              <Link href="/add-studio" className="btn btn-primary">
                Host Your Space
              </Link>
            </div>
          )}

          {!error &&
            studios.map(studio => {
              const id = String(studio._id);
              return (
                <StudioCard
                  key={id}
                  studio={studio}
                  saved={saved.has(id)}
                  busy={String(busyId) === id}
                  onToggle={toggle}
                />
              );
            })}
        </div>

        <div className="fs-more">
          <Link href="/studios" className="btn btn-outline btn-sm">
            View All Studios
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

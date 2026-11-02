'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Search, SearchX } from 'lucide-react';
import StudioCard, { CardSkeleton } from '../components/StudioCard';
import useWishlist from '../components/useWishlist';
import { apiFetch } from '@/lib/api';
import { CATEGORY_LABELS } from '@/lib/categories';
import '../components/featured-studios.css';
import './studios.css';

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

function Explore() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get('category') || '';
  const initialSearch = params.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [query, setQuery] = useState(initialSearch); // debounce howar por
  const [sort, setSort] = useState('newest');
  const [studios, setStudios] = useState(null);
  const [counts, setCounts] = useState({}); // { 'photo-studio': 3, ... }
  const [error, setError] = useState(false);
  const { saved, busyId, toggle } = useWishlist();
  const lastToast = useRef(0);
  const chipsRef = useRef(null);
  const activeLabel = CATEGORY_LABELS[category];
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  // Search box: 400ms thamle tabei API call hobe
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Category chip gulor count (GET /api/studios/category-counts), ekbar load hoy
  useEffect(() => {
    apiFetch('/api/studios/category-counts')
      .then(setCounts)
      .catch(() => {});
  }, []);

  // Home card / hero / footer theke category niye ashle active chip screen e ashe
  useEffect(() => {
    chipsRef.current?.querySelector('.ex-chip.active')?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [category]);

  useEffect(() => {
    let alive = true;
    setStudios(null);
    setError(false);
    const qs = new URLSearchParams({ sort });
    if (category) qs.set('category', category);
    if (query) qs.set('search', query);

    apiFetch(`/api/studios?${qs}`)
      .then(data => alive && setStudios(data))
      .catch(err => {
        if (!alive) return;
        setError(true);
        setStudios([]);
        if (Date.now() - lastToast.current > 2000) {
          lastToast.current = Date.now();
          toast.error(err.message || 'Could not load studios.');
        }
      });
    return () => {
      alive = false;
    };
  }, [category, query, sort]);

  const pickCategory = slug => {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set('category', slug);
    else next.delete('category');
    router.replace(next.toString() ? `/studios?${next}` : '/studios', {
      scroll: false,
    });
  };

  const clearAll = () => {
    setSearch('');
    setQuery('');
    setSort('newest');
    router.replace('/studios', { scroll: false });
  };

  return (
    <section className="ex-page">
      <div className="container">
        <div className="pg-head">
          <div>
            <h1>Explore Studios</h1>
            <p>
              {activeLabel
                ? `Showing ${activeLabel} spaces you can book by the hour.`
                : 'Find the right creative space and book it by the hour.'}
            </p>
          </div>
        </div>

        <div className="ex-toolbar">
          <label className="ex-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by studio name or location"
              aria-label="Search studios"
            />
          </label>
          <select
            className="ex-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Sort studios"
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="ex-chips"
          ref={chipsRef}
          role="group"
          aria-label="Studio categories"
        >
          <button
            type="button"
            className={`ex-chip ${!category ? 'active' : ''}`}
            aria-pressed={!category}
            onClick={() => pickCategory('')}
          >
            All
            {totalCount > 0 && (
              <small style={{ opacity: 0.7, marginLeft: 6 }}>
                {totalCount}
              </small>
            )}
          </button>
          {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
            <button
              key={slug}
              type="button"
              className={`ex-chip ${category === slug ? 'active' : ''}`}
              aria-pressed={category === slug}
              onClick={() => pickCategory(slug)}
            >
              {label}
              {typeof counts[slug] === 'number' && (
                <small style={{ opacity: 0.7, marginLeft: 6 }}>
                  {counts[slug]}
                </small>
              )}
            </button>
          ))}
        </div>

        {studios && !error && (
          <p className="ex-count">
            <strong>{studios.length}</strong>{' '}
            {studios.length === 1 ? 'studio' : 'studios'} found
          </p>
        )}

        <div className="fs-grid">
          {!studios &&
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}

          {studios && error && (
            <div className="fs-state">
              <h3>We couldn&apos;t load the studios</h3>
              <p>Please check your connection and try again.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {studios && !error && studios.length === 0 && (
            <div className="fs-state">
              <SearchX size={36} />
              <h3>No studios match your search</h3>
              <p>
                Try a different keyword or category, or host a space yourself.
              </p>
              <div
                style={{ display: 'flex', gap: 10, justifyContent: 'center' }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={clearAll}
                >
                  Clear filters
                </button>
                <Link href="/add-studio" className="btn btn-primary">
                  Host Your Space
                </Link>
              </div>
            </div>
          )}

          {studios &&
            !error &&
            studios.map(s => (
              <StudioCard
                key={s._id}
                studio={s}
                saved={saved.has(String(s._id))}
                busy={String(busyId) === String(s._id)}
                onToggle={toggle}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <Explore />
    </Suspense>
  );
}

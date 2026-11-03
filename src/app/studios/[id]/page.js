'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { categoryLabel } from '@/lib/categories';
import { API, resolveImage } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import BookingModal from '../../components/BookingModal';
import ReviewForm from '../../components/ReviewForm';
import '../../components/featured-studios.css'; // card badge, skeleton, empty-state style
import './details.css';

function Stars({ value = 0, size = 14 }) {
  return (
    <span className="dt-stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={size}
          fill={n <= Math.round(value) ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

function DetailsSkeleton() {
  return (
    <section className="dt-page">
      <div className="container dt-layout" aria-hidden="true">
        <div>
          <div className="dt-main-img sk-block" />
          <div className="sk-line w70" style={{ height: 28, marginTop: 24 }} />
          <div className="sk-line w40" />
          <div className="sk-line" style={{ height: 90 }} />
        </div>
        <div className="dt-card sk-block" style={{ height: 320 }} />
      </div>
    </section>
  );
}

export default function StudioDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [studio, setStudio] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound | error
  const [index, setIndex] = useState(0);
  const [booking, setBooking] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus('loading');
    fetch(`${API}/api/studios/${id}`, { signal: ctrl.signal })
      .then(async r => {
        if (r.status === 404 || r.status === 400) return setStatus('notfound');
        if (!r.ok) throw new Error('Failed');
        setStudio(await r.json());
        setIndex(0);
        setStatus('ok');
      })
      .catch(e => {
        if (e.name === 'AbortError') return;
        setStatus('error');
        toast.error('Could not load this studio. Please try again.');
      });
    return () => ctrl.abort();
  }, [id]);

  if (status === 'loading') return <DetailsSkeleton />;

  if (status !== 'ok') {
    return (
      <section className="dt-page">
        <div className="container">
          <div className="fs-state">
            <h3>
              {status === 'notfound'
                ? "We couldn't find this studio"
                : 'Something went wrong'}
            </h3>
            <p>
              {status === 'notfound'
                ? 'It may have been removed by the host. Browse other spaces instead.'
                : 'Check your connection and try again.'}
            </p>
            <Link href="/studios" className="btn btn-primary">
              Back to Explore
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const gallery = studio.gallery?.length ? studio.gallery : [studio.image];
  const go = dir => setIndex(i => (i + dir + gallery.length) % gallery.length);

  // Login na thakle login e pathay, thakle booking modal khole
  const handleBook = () => {
    if (!user) {
      toast.info('Please log in to book this studio.');
      router.push(`/login?redirect=/studios/${id}`);
      return;
    }
    if (user.email === studio.ownerEmail) {
      toast.info('This is your own studio, so you cannot book it.');
      return;
    }
    setBooking(true);
  };

  return (
    <section className="dt-page">
      <div className="container">
        <Link href="/studios" className="dt-back">
          <ArrowLeft size={16} /> Back to all studios
        </Link>

        <div className="dt-layout">
          {/* ---------- Left column ---------- */}
          <div>
            <div className="dt-gallery">
              <div className="dt-main-img">
                <img
                  src={resolveImage(gallery[index])}
                  alt={`${studio.title} photo ${index + 1}`}
                />
                <span className="fs-badge">
                  {categoryLabel(studio.category)}
                </span>
                {gallery.length > 1 && (
                  <>
                    <button
                      className="dt-nav prev"
                      onClick={() => go(-1)}
                      aria-label="Previous photo"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="dt-nav next"
                      onClick={() => go(1)}
                      aria-label="Next photo"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <span className="dt-counter">
                      {index + 1} / {gallery.length}
                    </span>
                  </>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="dt-thumbs">
                  {gallery.map((g, i) => (
                    <button
                      key={g}
                      className={`dt-thumb ${i === index ? 'active' : ''}`}
                      onClick={() => setIndex(i)}
                      aria-label={`Show photo ${i + 1}`}
                    >
                      <img src={resolveImage(g)} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <h1 className="dt-title">{studio.title}</h1>
            <div className="dt-meta">
              <span>
                <MapPin size={15} /> {studio.location}
              </span>
              <span className="dt-rate">
                <Stars value={studio.rating} />
                <strong>{Number(studio.rating).toFixed(1)}</strong>
                <em>({studio.reviewsCount} reviews)</em>
              </span>
              <span>
                <Users size={15} /> Up to {studio.maxCapacity} people
              </span>
            </div>

            <h2 className="dt-h2">About this space</h2>
            <p className="dt-text">{studio.overview}</p>

            <h2 className="dt-h2">Amenities</h2>
            <ul className="dt-amenities">
              {studio.amenities?.map(a => (
                <li key={a}>
                  <Check size={16} /> {a}
                </li>
              ))}
            </ul>

            <h2 className="dt-h2">Reviews</h2>
            {studio.reviews?.length ? (
              <div className="dt-reviews">
                {studio.reviews.map((r, i) => (
                  <article key={i} className="dt-review">
                    <div className="dt-avatar">{r.name?.charAt(0)}</div>
                    <div>
                      <div className="dt-review-head">
                        <strong>{r.name}</strong>
                        <Stars value={r.rating} size={13} />
                      </div>
                      <p>{r.comment}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="dt-text">
                No reviews yet. Be the first to book and review this space.
              </p>
            )}
            <ReviewForm studio={studio} user={user} onAdded={setStudio} />
          </div>

          {/* ---------- Right column: booking card ---------- */}
          <aside className="dt-card">
            <p className="dt-price">
              ${studio.hourlyRate} <small>/ hour</small>
            </p>
            <ul className="dt-facts">
              <li>
                <span>Security deposit</span>
                <strong>${studio.securityDeposit}</strong>
              </li>
              <li>
                <span>Max capacity</span>
                <strong>{studio.maxCapacity} people</strong>
              </li>
              <li>
                <span>Category</span>
                <strong>{categoryLabel(studio.category)}</strong>
              </li>
            </ul>

            <button className="btn btn-primary dt-book" onClick={handleBook}>
              Book Workspace Now
            </button>
            <p className="dt-safe">
              <ShieldCheck size={15} /> Free cancellation while your booking is
              pending
            </p>

            <div className="dt-host">
              <div className="dt-avatar">{studio.ownerName?.charAt(0)}</div>
              <div>
                <small>Hosted by</small>
                <strong>{studio.ownerName}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {booking && (
        <BookingModal studio={studio} onClose={() => setBooking(false)} />
      )}
    </section>
  );
}

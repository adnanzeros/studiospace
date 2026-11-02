'use client';

import Link from 'next/link';
import { Heart, MapPin, Star } from 'lucide-react';
import { categoryLabel } from '@/lib/categories';
import { resolveImage } from '@/lib/api';
import './featured-studios.css';

export function CardSkeleton() {
  return (
    <div className="fs-card fs-skel" aria-hidden="true">
      <div className="fs-media" />
      <div className="fs-body">
        <div className="sk-line w70" />
        <div className="sk-line w40" />
        <div className="fs-foot">
          <div className="sk-line w40" style={{ marginBottom: 0 }} />
          <div className="sk-btn" />
        </div>
      </div>
    </div>
  );
}

// Home (Featured) ar Explore page duto jaygay ei card
export default function StudioCard({
  studio,
  saved = false,
  busy = false,
  onToggle,
}) {
  const id = studio._id;
  return (
    <article className="fs-card">
      <div className="fs-media">
        <img
          src={resolveImage(studio.image)}
          alt={studio.title}
          loading="lazy"
        />
        <span className="fs-badge">{categoryLabel(studio.category)}</span>
        <button
          type="button"
          className={`fs-heart ${saved ? 'active' : ''}`}
          onClick={() => onToggle?.(id)}
          disabled={busy}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={saved}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="fs-body">
        <div className="fs-row">
          <h3 className="fs-name" title={studio.title}>
            {studio.title}
          </h3>
          <span className="fs-rating">
            <Star
              size={11}
              style={{
                display: 'inline',
                marginRight: 3,
                verticalAlign: '-1px',
              }}
              fill="currentColor"
            />
            {Number(studio.rating || 0).toFixed(1)}
          </span>
        </div>

        <p className="fs-loc">
          <MapPin size={14} /> {studio.location}
        </p>

        <div className="fs-foot">
          <p className="fs-price">
            ${studio.hourlyRate} <small>/ hr</small>
          </p>
          <Link href={`/studios/${id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeading from './SectionHeading';
import { categories } from '@/lib/assets';
import './browse-categories.css';

// `counts` is optional: { "photo-studio": 3, "film-stage": 2, ... }
// Fetch it on the server from GET /api/studios/category-counts and pass it in.
export default function BrowseCategories({ counts = {} }) {
  return (
    <section className="section soft-bg" id="categories">
      <div className="container">
        <SectionHeading
          eyebrow="Browse by Category"
          title="Find the space that fits your craft"
          subtitle="Choose a category and we will show you every matching studio."
        />

        <div className="cat-grid">
          {categories.map(cat => {
            const total = counts[cat.slug];
            return (
              <Link
                key={cat.slug}
                href={`/studios?category=${cat.slug}`}
                className="cat-card"
                aria-label={`Browse ${cat.label}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  width={600}
                  height={400}
                  className="cat-card-img"
                  unoptimized
                />
                <div className="cat-card-body">
                  <span>
                    <b>{cat.label}</b>
                    <small>
                      {typeof total === 'number'
                        ? `${total} ${total === 1 ? 'space' : 'spaces'}`
                        : 'Browse spaces'}
                    </small>
                  </span>
                  <span className="cat-card-go" aria-hidden="true">
                    <FiArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

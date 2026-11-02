import Link from 'next/link';

export const metadata = { title: 'About Us | StudioSpace' };

export default function AboutPage() {
  return (
    <section className="container">
      <div className="doc">
        <span className="eyebrow">About StudioSpace</span>
        <h1>A marketplace built for people who make things</h1>
        <p>
          StudioSpace is a peer-to-peer marketplace where studio owners list
          photography cyc walls, sound stages, podcast lounges, music suites and
          art workshops, and creators book them by the hour with clear pricing.
        </p>
        <p>
          We started StudioSpace because great spaces sit empty while creators
          struggle to find a reliable room for a single afternoon. Our platform
          connects both sides with transparent rates, simple booking and host
          protection.
        </p>

        <div className="about-grid">
          <div className="stat">
            <strong>5</strong>
            <span>Studio categories</span>
          </div>
          <div className="stat">
            <strong>24/7</strong>
            <span>Host support</span>
          </div>
          <div className="stat">
            <strong>0</strong>
            <span>Hidden fees</span>
          </div>
        </div>

        <h2>What we believe</h2>
        <ul>
          <li>Creative spaces should be easy to find and fair to book.</li>
          <li>Hosts deserve verified guests and protected equipment.</li>
          <li>
            Creators deserve clear prices and instant confirmation updates.
          </li>
        </ul>

        <div
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}
        >
          <Link href="/studios" className="btn btn-primary">
            Explore Studios
          </Link>
          <Link href="/add-studio" className="btn btn-outline">
            Host Your Space
          </Link>
        </div>
      </div>
    </section>
  );
}

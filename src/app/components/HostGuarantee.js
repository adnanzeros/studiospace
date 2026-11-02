import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Headset,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { guarantees } from '@/lib/assets';
import './host-guarantee.css';

const ICONS = { ShieldCheck, BadgeCheck, Wrench, Headset };

export default function HostGuarantee() {
  return (
    <section
      className="section soft-bg hg-section over-footer"
      id="host-guarantee"
    >
      <div className="container">
        <div className="hg-layout">
          <div className="hg-copy">
            <span className="eyebrow">
              Host Guarantee &amp; Creator Support
            </span>
            <h2 className="title hg-title">
              Book and host with{' '}
              <span className="text-gradient">total confidence</span>
            </h2>
            <p className="sub hg-sub">
              StudioSpace protects both sides of every booking with insurance,
              identity checks, safety standards and round-the-clock support.
            </p>
            <div className="hg-actions">
              <Link href="/add-studio" className="btn btn-primary">
                Host Your Space <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="hg-grid">
            {guarantees.map(item => {
              const Icon = ICONS[item.icon] || ShieldCheck;
              return (
                <article key={item.title} className="hg-card">
                  <div className="hg-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

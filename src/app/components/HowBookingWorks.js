import Link from 'next/link';
import { CalendarClock, Clapperboard, Search, Zap } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { bookingSteps } from '@/lib/assets';
import './how-booking-works.css';

const ICONS = { Search, CalendarClock, Zap, Clapperboard };

export default function HowBookingWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <SectionHeading
          eyebrow="How Booking Works"
          title="From idea to shoot in four steps"
          subtitle="No back-and-forth emails. Find a space, pick your hours and book in minutes."
        />

        <ol className="steps">
          {bookingSteps.map((step, index) => {
            const Icon = ICONS[step.icon] || Search;
            return (
              <li key={step.title} className="step">
                <div className="step-icon">
                  <Icon size={26} />
                  <span className="step-num">{index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            );
          })}
        </ol>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="/how-it-works" className="btn btn-outline">
            See the full guide
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import {
  Search,
  CalendarClock,
  Zap,
  Clapperboard,
  UserPlus,
  ImagePlus,
  Database,
  Inbox,
  Heart,
  FileText,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import './how-it-works.css';

export const metadata = { title: 'How It Works | StudioSpace' };

const guestSteps = [
  {
    icon: Search,
    title: 'Discover a space',
    text: 'Open Explore Studios, search by name or location, pick a category and sort by rating or price.',
  },
  {
    icon: CalendarClock,
    title: 'Choose your hours',
    text: 'Select a date, a start time and 1 to 12 hours. Slots already confirmed for someone else are blocked.',
  },
  {
    icon: Zap,
    title: 'Send your booking',
    text: 'Your request is sent to the host as Pending with the full price shown up front.',
  },
  {
    icon: Clapperboard,
    title: 'Show up and create',
    text: 'Once the host confirms, the slot is yours. Download your invoice and start shooting, recording or rehearsing.',
  },
];

const hostSteps = [
  {
    icon: UserPlus,
    title: 'Create an account',
    text: 'Register with email and password, or continue with Google, then log in.',
  },
  {
    icon: ImagePlus,
    title: 'Add your studio',
    text: 'Open Add New Studio, fill in the title, category, location, rates, capacity, amenities and overview, then upload a photo.',
  },
  {
    icon: Database,
    title: 'Publish it',
    text: 'The photo is hosted on ImgBB and the listing, with its image link, is saved in our database. You land on My Studio Listings.',
  },
  {
    icon: Inbox,
    title: 'Manage requests',
    text: 'Confirm or decline booking requests, and edit or remove your listing whenever you need.',
  },
];

const features = [
  {
    icon: Search,
    title: 'Search, filter and sort',
    text: 'Five categories, live search and sorting by newest, rating or price.',
  },
  {
    icon: Heart,
    title: 'Wishlist',
    text: 'Save studios you like and come back to them from your wishlist.',
  },
  {
    icon: ShieldCheck,
    title: 'No double bookings',
    text: 'A time slot that overlaps a confirmed booking cannot be requested.',
  },
  {
    icon: FileText,
    title: 'PDF invoices',
    text: 'Confirmed and completed bookings come with a downloadable invoice.',
  },
  {
    icon: LayoutDashboard,
    title: 'Personal dashboard',
    text: 'See your listings, bookings, pending requests and saved studios at a glance.',
  },
];

const faqs = [
  {
    q: 'Do I need an account to browse?',
    a: 'No. Anyone can explore studios and read details. You need to log in to book, save a studio or host.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes, while it is still Pending you can cancel it from My Bookings.',
  },
  {
    q: 'Can I book my own studio?',
    a: 'No. Hosts cannot book their own listings.',
  },
  {
    q: 'What is the security deposit?',
    a: 'A refundable amount set by the host for each studio. It may be applied to damage. See our Terms of Service for details.',
  },
];

function Steps({ items }) {
  return (
    <ol className="hiw-steps">
      {items.map((s, i) => (
        <li key={s.title} className="hiw-step">
          <div className="hiw-icon">
            <s.icon size={24} />
            <span className="hiw-num">{i + 1}</span>
          </div>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <section className="section soft-bg hiw-top">
        <div className="container">
          <SectionHeading
            eyebrow="How It Works"
            title="Book a creative space, or share yours"
            subtitle="StudioSpace connects studio owners with photographers, filmmakers, podcasters and musicians. Here is how both sides use it."
          />
          <div className="hiw-cta">
            <Link href="/studios" className="btn btn-primary">
              Explore Studios
            </Link>
            <Link href="/add-studio" className="btn btn-outline">
              Host Your Space
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="for-creators">
        <div className="container">
          <SectionHeading
            eyebrow="For creators"
            title="From idea to shoot in four steps"
            subtitle="No back-and-forth emails. Find a space, pick your hours and book."
          />
          <Steps items={guestSteps} />
        </div>
      </section>

      <section className="section soft-bg" id="for-hosts">
        <div className="container">
          <SectionHeading
            eyebrow="For hosts"
            title="List your studio and start earning"
            subtitle="Turn unused hours into income. You stay in control of every booking."
          />
          <Steps items={hostSteps} />
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <SectionHeading
            eyebrow="What you can do"
            title="Everything in one place"
            subtitle="Tools that keep booking simple and fair for both sides."
          />
          <div className="hiw-grid">
            {features.map(f => (
              <div key={f.title} className="hiw-card">
                <div className="hiw-icon sm">
                  <f.icon size={20} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft-bg" id="faq">
        <div className="container">
          <SectionHeading eyebrow="FAQ" title="Quick answers" />
          <div className="hiw-faq">
            {faqs.map(f => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="hiw-legal">
            By using StudioSpace you agree to our{' '}
            <Link href="/terms">Terms of Service</Link> and{' '}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

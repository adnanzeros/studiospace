// Central place for static copy used on the home page.
// Category card image gulo public/images/studios er existing photo.

export const categories = [
  {
    slug: 'photo-studio',
    label: 'Photo Studios',
    image: '/images/studios/lumen-loft-cyc-studio-1.jpg',
  },
  {
    slug: 'film-stage',
    label: 'Sound Stages',
    image: '/images/studios/director-cut-film-stage-1.jpg',
  },
  {
    slug: 'podcast-lounge',
    label: 'Podcast Rooms',
    image: '/images/studios/echo-room-podcast-lounge-1.jpg',
  },
  {
    slug: 'music-suite',
    label: 'Music Suites',
    image: '/images/studios/velvet-sound-music-suite-1.jpg',
  },
  {
    slug: 'workshop',
    label: 'Art Workshops',
    image: '/images/studios/palette-and-brush-workshop-1.jpg',
  },
];

// icon = lucide-react icon name (components e map kora ache)
export const bookingSteps = [
  {
    title: 'Discover Spaces',
    description:
      'Browse verified studios by category, location and hourly rate.',
    icon: 'Search',
  },
  {
    title: 'Select Shoot Hours',
    description: 'Pick your date and time slot with live availability.',
    icon: 'CalendarClock',
  },
  {
    title: 'Book Instantly',
    description:
      'Confirm in seconds with transparent pricing and no hidden fees.',
    icon: 'Zap',
  },
  {
    title: 'Create & Produce',
    description: 'Arrive, set up and start shooting, recording or rehearsing.',
    icon: 'Clapperboard',
  },
];

export const guarantees = [
  {
    title: 'Liability Protection',
    description:
      'Every confirmed booking is covered, so hosts and creators can work with peace of mind.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Verified Profiles',
    description:
      'Hosts and creators are identity-checked before their first booking.',
    icon: 'BadgeCheck',
  },
  {
    title: 'Equipment Safety',
    description:
      'Gear and lighting are inspected against safety standards before a space goes live.',
    icon: 'Wrench',
  },
  {
    title: '24/7 Host Support',
    description:
      'Our support team is on call around the clock for urgent session issues.',
    icon: 'Headset',
  },
];

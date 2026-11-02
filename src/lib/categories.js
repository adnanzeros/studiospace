// Category slug (DB) -> sundor label (UI)
export const CATEGORY_LABELS = {
  'photo-studio': 'Photo Studio',
  'film-stage': 'Film Stage',
  'podcast-lounge': 'Podcast Lounge',
  'music-suite': 'Music Suite',
  workshop: 'Workshop',
};

export const categoryLabel = slug =>
  CATEGORY_LABELS[slug] ||
  String(slug || '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// Add / Edit studio form er amenities checkbox
export const AMENITY_OPTIONS = [
  'Free Wi-Fi',
  'Air conditioning',
  'Free parking',
  'Changing room',
  'Green screen',
  'Strobe lighting kit',
  'Soundproofing',
  'Microphones',
  'Mixing console',
  'Props & backdrops',
  'Kitchenette',
  'Restroom',
];

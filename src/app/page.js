import Hero from './components/Hero';
import FeaturedStudios from './components/FeaturedStudios';
import BrowseCategories from './components/BrowseCategories';
import HowBookingWorks from './components/HowBookingWorks';
import HostGuarantee from './components/HostGuarantee';
import { API } from '@/lib/api';

export const dynamic = 'force-dynamic'; // MongoDB theke sobsomoy fresh data

async function load(path) {
  try {
    const res = await fetch(`${API}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const [studios, counts] = await Promise.all([
    load('/api/studios?limit=6&sort=rating'), // .limit(6) server e
    load('/api/studios/category-counts'),
  ]);

  return (
    <>
      <Hero />
      <FeaturedStudios studios={studios || []} error={studios === null} />
      <BrowseCategories counts={counts || {}} />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}

// Browser theke API call jabe "/backend/..." e (same-origin), Next ta Express server e proxy kore dey.
// Fole HTTPOnly JWT cookie (ss_token) first-party thake, CORS/cookie jhamela hoy na.
// NEXT_PUBLIC_API_URL = Express server er URL (local: http://localhost:5000, live: Render URL).
const API = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/backend/:path*', destination: `${API}/:path*` }];
  },
  images: {
    // ImgBB te host kora image gulo next/image diye dekhate hole lagbe
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: '**.ibb.co' },
    ],
  },
};

export default nextConfig;

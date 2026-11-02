# StudioSpace

> Peer-to-peer creative workspace & production studio sharing platform.

🔗 **Live site:** <<https://your-app.vercel.app>>
🛠️ **Server repo:** <<https://github.com/your-username/studiospace-server>>
🖥️ **API (Render):** <<https://your-api.onrender.com>>

## Features

- Browse, search, filter by category and sort studios by rating or price
- Hero slider (Swiper), featured studios from MongoDB, category shortcuts
- Email/password and Google login with BetterAuth, password rules enforced
- Hosts can add, update and delete listings, with ImgBB image upload
- Booking with live price summary, host confirm/decline, and double-booking prevention
- JWT in HTTPOnly cookies, protected API routes (401 for unauthorized requests)
- Light/dark theme toggle, toast notifications and custom confirm modals
- Saved studios wishlist and downloadable PDF booking invoices

## Tech Stack

- **Frontend:** Next.js (App Router), React, Swiper, Sonner, Lucide, jsPDF
- **Auth:** BetterAuth (MongoDB adapter) + JWT (HTTPOnly cookie)
- **Backend:** Express.js, MongoDB (Atlas)
- **Deployment:** Vercel (client) and Render (server)

## Local Setup

1. Clone the client and server repos, then run the server first:
   ```bash
   cd studiospace-server
   npm install
   cp .env.example .env   # fill in your values
   npm run seed           # optional demo studios
   npm run dev
   ```
2. Client:
   ```bash
   cd studiospace
   npm install
   ```
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_IMGBB_KEY=your_imgbb_key
   MONGODB_URI=your_mongodb_uri
   DB_NAME=studiospace
   BETTER_AUTH_SECRET=a_long_random_string
   BETTER_AUTH_URL=http://localhost:3000
   JWT_SECRET=same_value_as_the_server
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
3. Run `npm run dev` and open http://localhost:3000

## Examiner Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Guest / Host | <<examiner@example.com>> | <<Examiner123>> |
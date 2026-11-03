# StudioSpace

> Peer-to-peer creative workspace and production studio sharing platform.

## 🌐 Live Links

| | |
|---|---|
| **Live Website** | https://studiospace-sooty.vercel.app/ |
| **Client Repository** | https://github.com/adnanzeros/studiospace |
| **Server Repository** | https://github.com/adnanzeros/sp-s
| **Backend API (Render)** | https://sp-s.onrender.com |

## ✨ Features

- Browse, search, filter by category and sort studios by rating or price
- Home page with Swiper hero slider, featured studios from MongoDB and category shortcuts
- Email/password and Google login with BetterAuth (password needs uppercase, lowercase and 6+ characters)
- Hosts can add, update and delete their studio listings, with image upload
- Booking system with live price summary and double-booking prevention for confirmed slots
- My Bookings page with Pending, Confirmed, Completed and Cancelled status badges
- JWT in HTTPOnly cookies with protected API routes (401 for unauthorized requests)
- Light/dark theme toggle, Sonner toast notifications and custom confirm modals
- Saved studios wishlist and downloadable PDF booking invoices
- Admin panel to manage studios, bookings and users

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Swiper, Sonner, Lucide, jsPDF
- **Authentication:** BetterAuth (MongoDB adapter) + JWT (HTTPOnly cookie)
- **Backend:** Express.js, MongoDB (Atlas)
- **Hosting:** Vercel (client) and Render (server)

## 🚀 Local Setup

1. Clone the repository and install packages:
   ```bash
   git clone https://github.com/adnanzeros/studiospace.git
   cd studiospace
   npm install
   ```
2. Start the Express server first (see the server repository) so it runs on `http://localhost:5000`.


3. Run the app and open http://localhost:3000
   ```bash
   npm run dev
   ```





### Admin panel

**URL:** https://studiospace-sooty.vercel.app/admin


---

**Project:** StudioSpace · **Developer:** Adnan Zeros
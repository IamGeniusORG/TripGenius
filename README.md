<div align="center">
  
# ✨ T R I P G E N I U S ✨
### An Elite AI-Powered Travel Concierge

> *"You don't just visit the future. You let the AI forge it for you."*

[![Next.js](https://img.shields.io/badge/Engine-Next.js_16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Cognitive Core](https://img.shields.io/badge/Core-Gemini_2.5_Flash-1A73E8?style=for-the-badge&logo=google)](https://deepmind.google/)
[![Security](https://img.shields.io/badge/Auth-Clerk_v3-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Database](https://img.shields.io/badge/DB-Prisma_PostgreSQL-316192?style=for-the-badge&logo=postgresql)](https://prisma.io)

TripGenius is a next-generation AI travel planner that moves beyond static itineraries. It uses advanced cognitive reasoning to dynamically forge magazine-style, hyper-personalized travel plans based on exact spending power, geographic context, and blended travel styles.

</div>

<br/>

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#-tech-stack)
- [⚙️ Installation & Setup](#-installation--setup)
- [🔐 Environment Variables](#-environment-variables)
- [🗺️ Future Roadmap](#-future-roadmap)
- [📜 Legal & Compliance](#-legal--compliance)

---

## ✨ Key Features

TripGenius is packed with cutting-edge features designed to provide a seamless, premium UX:

### 🧠 Cognitive AI Routing
- **Universal Currency Engine:** No standard "Budget/Luxury" dropdowns. Users input free-text budgets in any currency (e.g., *"50,000 INR"* or *"£2000 for 4 people"*). The AI silently parses the destination's purchasing power and calibrates a hidden comfort tier automatically.
- **Multi-Style Blending:** Select multiple travel vibes (Culture, Adventure, Nightlife, Foodie). The engine seamlessly blends them, ensuring every requested style is represented in the final itinerary.
- **Post-Generation Mutation:** Don't like a specific day? Use the minimalist modification interface to chat with your itinerary. Ask the AI to *"Make the dinners cheaper"* or *"Add a day trip to Kyoto"*, and it natively patches the JSON tree in real-time.

### 📍 Advanced Geolocation
- **Interactive GPS Origin:** Click the origin navigator to trigger the browser's native Geolocation API.
- **Smart Reverse-Geocoding:** Converts raw Latitude/Longitude into precise City/Country strings via OpenStreetMap.
- **Graceful IP Fallback:** If GPS is denied or unavailable, the system silently falls back to IPStack to securely approximate the user's origin via their IP address.

### 🎨 Dark Matter UI & Typography
- **Premium Glassmorphism:** Built on Tailwind CSS v4, featuring reactive cursor-tracking radial energy fields, beautiful backdrop-blurs, and fluid Framer Motion transitions.
- **Dynamic Contextual Iconography:** Activity timelines automatically parse the time of day and inject situational icons (🌅 Morning, ☀️ Afternoon, 🌇 Evening, 🌙 Night).
- **Live Maps Binding:** Top destination cards aren't just text—they are interactively bound to dynamically encoded Google Maps search queries, complete with hover state indicators.

### 📸 Real-World Media Integration
- **Unsplash API Holographics:** Fetches real-world, high-resolution photography for destinations and accommodations based on AI-generated image keywords.
- **Deterministic Caching:** Uses cryptographic `tripSeed` locks to ensure a unique but consistent visual matrix for every generated simulation.
- **Robust Fallbacks:** Integrates sleek placeholder UI systems if rate limits are hit, ensuring the site never breaks.

### 🔒 Accounts & Sharing
- **Secure Dashboards:** Authenticated via Clerk. Logged-in users have their trips securely persisted to a PostgreSQL database via Prisma.
- **Public Share Links:** Every trip generates a beautiful, shareable `/share/[id]` URL so users can send their itineraries to friends and family.

---

## 🛠️ Tech Stack

**Frontend Architecture:**
- **Framework:** Next.js 16.3 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **Animation:** Framer Motion
- **Components:** Shadcn UI (Radix Primitives)

**Backend & Data:**
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** Clerk Core v3
- **AI Engine:** OpenRouter (Google Gemini 2.5 Flash / OpenAI GPT-4o-mini)
- **External APIs:** Unsplash (Images), IPStack (Fallback Geolocation), OpenStreetMap Nominatim (GPS Reverse-Geocoding)

---

## ⚙️ Installation & Setup

Initiate the development environment using standard protocols:

```bash
# 01. Clone the repository
git clone https://github.com/IamGeniusORG/TripGenius.git
cd TripGenius

# 02. Install dependencies
npm install

# 03. Push Prisma Database Schema
npx prisma db push

# 04. Ignite the local development server
npm run dev
```

*Access the application at `http://localhost:3000`*

---

## 🔐 Environment Variables

To run TripGenius locally, you must configure a `.env.local` file in the root directory with your respective API keys:

```env
# --- Identity Matrix (Clerk) ---
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# --- Cognitive Engine (OpenRouter/OpenAI) ---
OPENROUTER_API_KEY=sk-or-v1-...

# --- Neural Memory Bank (PostgreSQL) ---
DATABASE_URL=postgresql://user:password@host:port/db_name

# --- Holographic Fetcher (Unsplash) ---
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# --- Geolocation Fallback (IPStack) ---
IPSTACK_API_KEY=your_ipstack_api_key
```

---

## 🗺️ Future Roadmap

While the core engine is fully operational, the following premium features are slated for future releases:
- **Interactive Map Canvas:** Plotting the entire itinerary onto a live Mapbox/Google Maps canvas with day-to-day routing.
- **Live Booking Integration:** Direct affiliate links (Skyscanner, Airbnb, Booking.com) dynamically attached to the AI's recommendations.
- **Multi-Destination Routing:** Support for complex Euro-trips and cross-country road trips.
- **Collaborative Editing:** Multiplayer workspaces allowing friends to upvote activities and tweak the itinerary together in real-time.
- **Offline PDF Exports:** Sleek, downloadable PDF generations of the itinerary for offline travel use.

---

## 📜 Legal & Compliance
TripGenius features a comprehensive suite of SaaS legal compliance pages, including a fully animated global Cookie Consent banner, Privacy Policy, and Terms of Service.

<div align="center">
  <br/>
  <b>Crafted with ❤️ by Teddy.</b>
</div>

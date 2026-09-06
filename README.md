# 🌍 TripGenius

**TripGenius** is the world's most advanced AI-powered travel concierge. Built with Next.js 14 and modern web architectures, it allows users to generate highly detailed, personalized, day-by-day travel itineraries in seconds using advanced AI models.

![TripGenius Hero](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop)

---

## ✨ Features

- **🧠 Intelligent Itinerary Generation:** Give the AI your destination, budget, duration, and travel style (vibe), and receive a meticulously crafted, rich JSON itinerary complete with activities, schedules, and hotel recommendations.
- **🪄 Edit with AI:** Don't like a specific day? Want to make the trip cheaper? Click "Edit with AI" and just tell it what to change in natural language. The AI will intelligently patch your itinerary.
- **🌐 Discover Community Feed:** Publish your favorite trips to the global Discover feed to share your perfect vacation blueprints with the world.
- **📱 PWA Offline Mode:** Once you visit your trip link, a custom Service Worker securely caches it. You can view your dynamic itineraries while on an airplane or hiking with zero cellular service.
- **📄 Native PDF Export:** Download high-quality, perfectly formatted vector PDFs of your trip natively to email to hotels or print for your luggage.
- **🖼️ Dynamic Unsplash Imagery:** The AI generates highly specific image keywords for every single location and hotel, automatically pulling stunning photography from Unsplash to bring your trip to life.
- **🔒 Secure Authentication:** Fully integrated with Clerk for seamless, secure user sign-ups and route protection.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router) with React 19 & Turbopack
- **Styling:** Tailwind CSS v4 + Framer Motion for buttery-smooth animations
- **Components:** Shadcn UI (Radix / Base UI)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Authentication:** Clerk
- **AI Engine:** OpenRouter (Gemini 2.5 Flash / GPT-4o-mini)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/IamGeniusORG/TripGenius.git
cd ai-trip-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# PostgreSQL Database (Supabase/Neon)
DATABASE_URL="postgres://user:password@host:port/db"
DIRECT_URL="postgres://user:password@host:port/db"

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key

# Unsplash API
UNSPLASH_ACCESS_KEY=your_unsplash_key
```

### 4. Database Setup
Push the Prisma schema to your database:
```bash
npx prisma db push
npx prisma generate
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 💡 Architecture Notes
- **Server Components:** Heavily utilizes React Server Components (RSC) to directly fetch data from Prisma, drastically reducing client-side bundle sizes.
- **Offline Fallback:** The custom `sw.js` uses a `Network-First` caching strategy for pages and a `Cache-First` strategy for Unsplash images, ensuring flawless PWA behavior.

---

*Built for modern travelers, powered by AI.*

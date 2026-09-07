# 🌍 TripGenius

**TripGenius** is the world's most advanced AI-powered travel concierge. Built with Next.js 14 and modern web architectures, it allows users to generate highly detailed, personalized, day-by-day travel itineraries in seconds using advanced AI models. 

![TripGenius Hero](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop)

---

## ✨ Features

- **🧠 Intelligent AI Itinerary Generation:** Give the AI your destination, budget, duration, and travel style (vibe), and receive a meticulously crafted, rich JSON itinerary complete with activities, schedules, and hotel recommendations.
- **📊 AI Budget Estimation:** Automatically calculates and visualizes your estimated trip costs using interactive Recharts Donut charts, breaking down flights, food, and activities.
- **🎒 Interactive Packing Checklists:** A local-storage powered packing list generated specifically for your destination's climate and your travel style.
- **🌍 Massive Global Destination Library:** The AI engine is hooked up to a static geographical dataset covering **256 global countries and territories**, complete with smart fallback landmarks.
- **🛠️ Edit with AI:** Don't like a specific day? Want to make the trip cheaper? Click "Edit with AI" and just tell it what to change in natural language. The AI will intelligently patch your itinerary.
- **🔍 Discover Community Feed & Profiles:** Publish your favorite trips to the global Discover feed. Users get a dedicated public profile where the community can see their curated blueprints.
- **📱 PWA Offline Mode:** Once you visit your trip link, a custom Service Worker securely caches it. You can view your dynamic itineraries while on an airplane or hiking with zero cellular service.
- **📄 Native PDF Export:** Download high-quality, perfectly formatted vector PDFs of your trip natively to email to hotels or print for your luggage.
- **🖼️ Dynamic Unsplash Imagery:** The AI generates highly specific image keywords for every single location and hotel, automatically pulling stunning photography from Unsplash to bring your trip to life.
- **🔒 Secure Authentication & Rate Limiting:** Fully integrated with Clerk for seamless user sign-ups. Includes server-side rate-limiting logic to protect free API credits (5 trips/day).
- **🚀 Viral SEO Ready:** Every shared trip automatically generates dynamic OpenGraph Metadata tags with Unsplash backgrounds for stunning previews on Twitter, iMessage, and WhatsApp.

---

## 💻 Tech Stack

*   **Framework:** Next.js 14 (App Router, Server Components)
*   **Database:** Supabase (PostgreSQL) + Prisma ORM
*   **Authentication:** Clerk
*   **AI Engine:** Google Gemini Pro 1.5 (via OpenRouter)
*   **Styling:** Tailwind CSS + Framer Motion
*   **Charts & Icons:** Recharts, Lucide React
*   **Analytics:** Vercel Analytics

---

## 🚀 Getting Started

1. Clone the repository and install dependencies:
   \\\ash
   git clone https://github.com/IamGeniusORG/TripGenius.git
   cd ai-trip-planner
   npm install
   \\\

2. Set up your \.env.local\ environment variables:
   \\\env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   DATABASE_URL=postgresql://postgres...
   DIRECT_URL=postgresql://postgres...
   OPENROUTER_API_KEY=sk-or-v1-...
   UNSPLASH_ACCESS_KEY=your_key...
   \\\

3. Run Prisma Migrations to initialize your database:
   \\\ash
   npx prisma db push
   npx prisma generate
   \\\

4. Run the development server:
   \\\ash
   npm run dev
   \\\

5. Open [http://localhost:3000](http://localhost:3000) to start generating trips!
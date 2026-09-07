# 🌍 TripGenius

**TripGenius** is an advanced, production-ready AI travel concierge. Built with Next.js 14, it allows users to generate highly detailed, personalized, day-by-day travel itineraries in seconds using advanced AI models (Google Gemini 1.5).

![TripGenius Hero](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop)

---

## ✨ Features & Capabilities

TripGenius includes a massive suite of interactive and social features designed to make trip planning effortless:

- **🧠 Intelligent AI Generation:** Give the AI your destination, budget, duration, and travel style (vibe). It mathematically balances your budget and generates a rich JSON itinerary.
- **🌍 Massive Global Dictionary:** The destination input features a smart auto-complete library mapping out **256 global countries and territories**, complete with smart fallback landmarks.
- **📊 AI Budget Estimation:** Automatically calculates and visualizes your estimated trip costs using interactive Recharts Donut charts, breaking down flights, food, and activities.
- **🎒 Interactive Packing Checklists:** A responsive, interactive packing list generated specifically for your destination's climate. It uses localStorage to remember which items you've checked off.
- **🕰️ Smart Timeline Icons:** The AI naturally parses exact times (AM/PM) and meals (Breakfast, Lunch, Dinner) and applies beautiful, color-coded Lucide icons to your daily itinerary timeline.
- **🔍 Discover Community Feed:** Publish your favorite trips to the global Discover feed.
- **👤 Public User Profiles:** Users get a dedicated public profile page where the community can browse all of their curated public blueprints.
- **🔖 Save & Bookmark Trips:** Found a trip you like on the Discover feed? Click the Save button to instantly bookmark it to your personal Dashboard.
- **🛠️ Edit with AI:** Don't like a specific day? Click "Edit with AI" and tell it what to change in natural language. The AI intelligently patches your itinerary.
- **📱 PWA Offline Mode:** Your generated trips are cached by a custom Service Worker, allowing you to view your dynamic itineraries while on an airplane or hiking with zero cellular service.
- **📄 Native PDF Export:** Download high-quality, perfectly formatted vector PDFs of your trip natively to email to hotels or print.
- **🖼️ Dynamic Unsplash Imagery:** The AI generates highly specific image keywords for every single location, pulling stunning photography from Unsplash to bring your trip to life.
- **🚀 Viral SEO Ready:** Every shared trip automatically generates dynamic OpenGraph Metadata tags with Unsplash backgrounds for stunning previews on Twitter, iMessage, and WhatsApp.

---

## ⚠️ Known Limitations (Total Transparency)

To maintain absolute transparency regarding the current state of the application, please note the following limitations:

1. **Strict Rate Limiting (2 Trips/Day):** Because the LLM generation requires heavy AI API credits, free users are strictly limited to **2 AI trip generations per rolling 24-hour window**. You can view your live remaining balance in the top navigation bar.
2. **Database Hibernation:** The application runs on the Supabase Free Tier. If the application receives zero traffic for 7 days, Supabase will automatically pause the database to save server resources. If this happens, the app will throw a 6543 Connection Error until the database is manually restored via the Supabase Dashboard.
3. **Generation Latency:** Generating a massive 5-to-7 day JSON itinerary with budgets and packing lists requires deep reasoning. Expect to wait **10 to 20 seconds** on the loading screen while the AI formulates the trip.
4. **Image Accuracy:** The app relies on the Unsplash API to fetch location images dynamically based on AI-generated keywords. While usually highly accurate, extremely obscure landmarks might occasionally pull a generic related image if the exact location isn't in Unsplash's database.
5. **Monetization Deferred:** Stripe payment integration for premium tiers has intentionally been deferred until post-launch. The app is currently 100% free with the rate limits mentioned above.

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
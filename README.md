# 🌍 AI Trip Planner

An intelligent, full-stack travel advisory application built with Next.js. Tell the AI your destination, dates, budget, and travel style, and it will craft a personalized, flexible itinerary complete with accommodation tiers, daily activities, and dining options.

## ✨ Features

- **AI-Powered Itineraries:** Generates highly customized day-by-day travel plans using OpenRouter (Primary: Gemini 2.5 Flash, with auto-fallbacks to GPT-4o-mini and Claude 3 Haiku).
- **Flexible Options:** Instead of rigid schedules, the AI acts as a travel advisor, providing multiple accommodation tiers (Luxury, Mid-Range, Budget) and daily activity choices.
- **Secure Authentication:** Complete user lifecycle management (Sign In / Sign Up) powered by Clerk.
- **Personal Dashboard:** Logged-in users can view and manage their previously generated trips in a beautifully animated, protected dashboard.
- **Modern UI/UX:** Built with Tailwind CSS, `shadcn/ui` components, and Framer Motion for buttery-smooth animations.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** Framer Motion
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI SDK:** OpenAI Node SDK (configured for OpenRouter)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g., Supabase, Neon, or local)
- [Clerk](https://clerk.com/) Account for authentication
- [OpenRouter](https://openrouter.ai/) Account for AI API access

### 1. Clone the repository
```bash
git clone https://github.com/IamGeniusORG/AI-Trip-Planner.git
cd AI-Trip-Planner
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the provided example environment file:
```bash
cp .env.example .env.local
```
Then, fill in your `.env.local` with your specific keys:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `OPENROUTER_API_KEY`

### 4. Initialize the Database
Push the Prisma schema to your PostgreSQL database to create the required `Trip` tables:
```bash
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure
- `app/api/plan-trip`: Core AI logic and prompt engineering for itinerary generation.
- `app/dashboard`: Protected route displaying the user's saved trips fetched via Prisma.
- `app/page.tsx`: The main landing page and interactive itinerary generation form.
- `components/`: Reusable UI components (Navbar, TripCard, and shadcn/ui primitives).
- `prisma/schema.prisma`: Database models.

## 📄 License
This project is open-source and available under the MIT License.

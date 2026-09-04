import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-3xl space-y-8">
        <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Last Updated: September 2026</p>
        
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">1. Information We Collect</h2>
            <p>When you use TripGenius, we collect information necessary to provide you with the best AI travel concierge experience. This includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Authentication Data:</strong> We use Clerk to securely manage your account. We store your email address and profile information provided during sign-up.</li>
              <li><strong>Travel Preferences:</strong> The destinations, dates, budgets, and travel styles you input to generate itineraries.</li>
              <li><strong>Saved Trips:</strong> Itineraries you choose to save to your Dashboard are stored securely in our database.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">2. How We Use Your Information</h2>
            <p>We use the data we collect solely to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Generate highly personalized travel itineraries using AI.</li>
              <li>Save and retrieve your past trips via your personal Dashboard.</li>
              <li>Provide essential customer support and service updates.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">3. Third-Party Services</h2>
            <p>We rely on trusted third-party providers to power TripGenius:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>AI Generation:</strong> Your destination parameters are sent to OpenRouter (OpenAI/Anthropic/Google) to generate your itinerary.</li>
              <li><strong>Images:</strong> We fetch location images via the Unsplash API.</li>
              <li><strong>Authentication:</strong> Powered entirely by Clerk.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at tanmaydey005@gmail.com.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

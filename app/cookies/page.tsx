import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-3xl space-y-8">
        <h1 className="text-4xl font-black tracking-tight">Cookie Policy</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Last Updated: September 2026</p>
        
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">1. What are cookies?</h2>
            <p>Cookies are small text files that are stored on your browser or device by websites, apps, online media, and advertisements. They are used to remember your browser or device during and across website visits.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">2. How We Use Cookies</h2>
            <p>TripGenius uses cookies for the following essential purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Authentication:</strong> We use Clerk to authenticate users. Clerk sets secure cookies to keep you logged in while you navigate between the Dashboard and the Planner.</li>
              <li><strong>Preferences:</strong> We use local storage to remember your UI preferences, such as Dark Mode toggles and your Cookie Consent choice, so you aren't asked repeatedly.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">3. Managing Your Cookies</h2>
            <p>You have the right to choose whether or not to accept non-essential cookies. You can exercise your preferences via our Cookie Consent Banner that appears when you first visit the site.</p>
            <p>Additionally, most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience or lose access to authentication features.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

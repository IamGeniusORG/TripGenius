import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl space-y-10">
        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">Effective Date: September 2026</p>
        </div>
        
        <div className="space-y-10 text-zinc-700 dark:text-zinc-300 leading-relaxed text-base md:text-lg">
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">1. Introduction</h2>
            <p>Welcome to TripGenius (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are deeply committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI travel concierge services.</p>
            <p>Please read this privacy notice carefully as it will help you understand what we do with the information that we collect.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-6">A. Personal Information You Disclose to Us</h3>
            <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, or otherwise when you contact us. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Data:</strong> Name, email address, and authentication credentials (managed securely via Clerk).</li>
              <li><strong>User Content:</strong> Travel preferences, destinations, budgets, travel styles, and saved itineraries.</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-6">B. Information Automatically Collected</h3>
            <p>We automatically collect certain information when you visit, use, or navigate the application. This information does not reveal your specific identity (like your name) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, and location data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">3. How We Process Your Information</h2>
            <p>We process your information for a variety of legitimate business purposes, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>To facilitate account creation and logon process.</strong></li>
              <li><strong>To deliver and facilitate delivery of services to the user.</strong> We process your travel parameters through our AI engines to generate custom itineraries.</li>
              <li><strong>To respond to user inquiries and offer support.</strong></li>
              <li><strong>To protect our Services.</strong> We may use your information as part of our efforts to keep our application safe and secure.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">4. Sharing Your Information</h2>
            <p>We only share information with the following categories of third parties to enable core application functionality:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Authentication Services:</strong> Clerk handles all user identity and access management.</li>
              <li><strong>Cloud Computing and Storage:</strong> Vercel (Hosting) and Supabase (Database infrastructure).</li>
              <li><strong>Artificial Intelligence Providers:</strong> OpenRouter, OpenAI, Anthropic, or Google APIs process your destination requests to generate travel plans. No personally identifiable information (PII) is sent to these AI providers, only your travel parameters.</li>
              <li><strong>Media APIs:</strong> Unsplash API is used to fetch destination imagery based on generated locations.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">5. Data Retention and Security</h2>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law. Your saved trips will remain in your Dashboard until you choose to delete them.</p>
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">6. Your Privacy Rights (GDPR and CCPA)</h2>
            <p>Depending on your geographic location, you may have specific rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to request access and obtain a copy of your personal information.</li>
              <li>The right to request rectification or erasure of your data.</li>
              <li>The right to restrict the processing of your personal information.</li>
              <li>The right to data portability.</li>
            </ul>
            <p>To exercise any of these rights, you can delete your account data directly from your user dashboard or contact us using the details below.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">7. Updates to This Notice</h2>
            <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Effective Date&quot; and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">8. Contact Us</h2>
            <p>If you have questions or comments about this notice, you may email our Data Protection Officer (DPO) at:</p>
            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">TripGenius Privacy Team</p>
              <p>Email: <a href="mailto:tanmaydey005@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">tanmaydey005@gmail.com</a></p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
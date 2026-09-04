import { Sparkles, MessageSquare, Globe, Mail, Map } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 text-center md:text-left">
          
          <div className="md:col-span-1 flex flex-col items-center md:items-start space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-50 transition-colors group w-fit">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Map className="w-4 h-4 text-white" />
              </div>
              <span className="font-black tracking-tight text-xl">TripGenius</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              The world's most advanced AI travel concierge. Discover, plan, and experience your dream destinations with precision.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Plan a Trip</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My Dashboard</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Destinations</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Connect</h4>
            <div className="flex items-center justify-center md:justify-start space-x-6 text-zinc-400">
              <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="sr-only">Social</span>
              </a>
              <a href="https://github.com/IamGeniusORG" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <Globe className="w-5 h-5" />
                <span className="sr-only">Website</span>
              </a>
              <a href="mailto:tanmaydey005@gmail.com" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
                <span className="sr-only">Contact via Email</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-center text-center text-xs text-zinc-500 dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} TripGenius by IamGeniusORG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

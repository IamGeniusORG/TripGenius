import { Sparkles, MessageSquare, Globe, Mail, Map } from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 text-left">
          
          <div className="col-span-2 md:col-span-1 flex flex-col items-start space-y-3 md:space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-50 transition-colors group w-fit">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Logo className="w-5 h-5" globeColor="text-white" planeColor="text-blue-100" />
              </div>
              <span className="font-black tracking-tight text-lg md:text-xl">TripGenius</span>
            </Link>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              The world's most advanced AI travel concierge. Discover, plan, and experience your dream destinations with precision.
            </p>
          </div>
          
          <div className="col-span-1 flex flex-col items-start">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3 text-sm">Product</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Plan a Trip</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My Trips</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Destinations</Link></li>
            </ul>
          </div>

          <div className="col-span-1 flex flex-col items-start">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-start mt-2 md:mt-0">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3 text-sm">Connect</h4>
            <div className="flex items-center space-x-5 text-zinc-400">
              <a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                <span className="sr-only">Social</span>
              </a>
              <a href="https://github.com/IamGeniusORG" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <Globe className="w-4 h-4 md:w-5 md:h-5" />
                <span className="sr-only">Website</span>
              </a>
              <a href="mailto:tanmaydey005@gmail.com" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                <span className="sr-only">Contact via Email</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-center text-center text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} TripGenius by IamGeniusORG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}



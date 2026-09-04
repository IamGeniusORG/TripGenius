import { Sparkles, Twitter, Github, Linkedin, Map } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-50 transition-colors group w-fit">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Map className="w-4 h-4 text-white" />
              </div>
              <span className="font-black tracking-tight text-xl">TripGenius</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              The world's most advanced AI travel concierge. Discover, plan, and experience your dream destinations with precision.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Plan a Trip</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My Dashboard</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Destinations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Connect</h4>
            <div className="flex items-center space-x-4 text-zinc-400">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com/IamGeniusORG" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} TripGenius by IamGeniusORG. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0">
            <span>Powered by</span>
            <Sparkles className="w-3 h-3 text-blue-500 mx-1" />
            <span className="font-medium text-zinc-900 dark:text-zinc-50">Antigravity AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

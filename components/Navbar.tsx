import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, Map } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-zinc-900 dark:text-zinc-50 hover:text-blue-600 transition-colors">
          <Map className="w-6 h-6 text-blue-600" />
          <span>AI Trip Planner</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 mr-4">
              My Trips
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

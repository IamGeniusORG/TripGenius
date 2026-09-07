"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, Map, Moon, Sun, Globe } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { userId } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="w-full mx-auto px-4 md:px-12 lg:px-24 xl:px-32 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
          <div className="bg-blue-600/10 p-1.5 rounded-lg group-hover:bg-blue-600/20 transition-colors">
            <Logo className="w-6 h-6" />
          </div>
          <span className="font-black tracking-tight text-xl">TripGenius</span>
        </Link>
        
        <div className="hidden lg:flex items-center space-x-2 sm:space-x-4 mr-4">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">5 Free Trips / Day</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-zinc-900 dark:text-zinc-50" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-zinc-900 dark:text-zinc-50" />
              <span className="sr-only">Toggle theme</span>
            </button>
          )}

          {userId ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/discover" className="mr-2">
                <Button variant="ghost" className="flex items-center space-x-2 font-bold px-3 sm:px-4 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Discover</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" className="flex items-center space-x-2 font-bold shadow-sm px-3 sm:px-4">
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">My Trips</span>
                </Button>
              </Link>
              <div className="h-6 sm:h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-colors"
                  }
                }}
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}


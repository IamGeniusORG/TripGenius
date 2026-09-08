"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, Map, Moon, Sun, Globe, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { userId } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tripCount, setTripCount] = useState({ count: 0, limit: 2 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/user/trip-count");
        if (res.ok) {
          const data = await res.json();
          setTripCount(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchCount();
    // Reactively update count when window regains focus (e.g. after generating a trip and coming back to top, or just active usage)
    window.addEventListener("focus", fetchCount);
    return () => window.removeEventListener("focus", fetchCount);
  }, [userId]);

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
          <span className="font-black tracking-tight text-xl hidden sm:inline-block">TripGenius</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {mounted && userId && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 transition-all">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                {Math.max(0, tripCount.limit - tripCount.count)}/{tripCount.limit} Free Trips
              </span>
            </div>
          )}
          
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
            <div className="flex items-center space-x-4">
              <Link href="/discover">
                <Button variant="ghost" className="flex items-center space-x-2 font-bold px-4 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400">
                  <Globe className="w-4 h-4" />
                  <span>Discover</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" className="flex items-center space-x-2 font-bold shadow-sm px-4">
                  <Map className="w-4 h-4" />
                  <span>My Trips</span>
                </Button>
              </Link>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
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

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center space-x-3">
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
          {userId && (
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9 border-2 border-zinc-200 dark:border-zinc-800"
                }
              }}
            />
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-4 w-72 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
          {userId ? (
            <>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {Math.max(0, tripCount.limit - tripCount.count)}/{tripCount.limit} Free Trips Left
                </span>
              </div>
              <Link href="/discover" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-200">
                <Globe className="w-5 h-5" />
                <span>Discover</span>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-200">
                <Map className="w-5 h-5" />
                <span>My Trips</span>
              </Link>
            </>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <SignInButton mode="modal">
                <button className="w-full py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign In to Plan
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
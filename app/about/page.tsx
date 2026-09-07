import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Globe, Map, Sparkles, Heart } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1 w-full mx-auto px-4 md:px-12 lg:px-24 xl:px-32 py-32 max-w-4xl space-y-10">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-8 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">About TripGenius</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg md:text-xl mt-4 max-w-2xl">
            Redefining how the world explores, one perfectly tailored itinerary at a time.
          </p>
        </div>
        
        <div className="space-y-12 text-zinc-700 dark:text-zinc-300 leading-relaxed text-base md:text-lg">
          
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">Our Story</h2>
            <p>
              TripGenius was born out of a simple frustration: planning a trip shouldn't be harder than taking one. 
              Scouring through dozens of tabs, cross-referencing flights with hotels, and trying to figure out if that 
              &quot;must-see&quot; attraction is actually a tourist trap takes the joy out of traveling.
            </p>
            <p>
              We believed there had to be a better way. By harnessing the power of advanced Artificial Intelligence, 
              we set out to create a digital concierge that understands your exact preferences, budget, and travel style, 
              delivering a comprehensive, minute-by-minute itinerary in seconds.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <Globe className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Global Reach</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                From the bustling streets of Tokyo to the serene beaches of Santorini, our AI maps out the world with hyper-localized precision.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <Map className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Smart Routing</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                No more zigzagging across a city. We optimize your daily routes so you spend less time in transit and more time making memories.
              </p>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">Why We Built This</h2>
            <p>
              Time is our most valuable asset, especially when we are on vacation. We built TripGenius to give you that time back. 
              Instead of spending 20 hours planning a 7-day trip, we want you to spend 20 seconds entering your preferences, 
              and instantly receive a perfectly curated, printable, and shareable plan.
            </p>
            <p>
              We integrate seamlessly with major providers like MakeMyTrip and IRCTC to ensure that once your plan is set, 
              booking the logistics is just a single click away.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">Crafted with Passion</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Behind every line of code and every generated itinerary is a deep love for travel and technology. 
              Thank you for trusting TripGenius with your adventures.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
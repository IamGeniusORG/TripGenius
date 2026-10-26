"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Calendar, Sparkles, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  resetsAt?: string;
  isGuest?: boolean;
}

export function LimitReachedModal({
  isOpen,
  onClose,
  message,
  resetsAt,
  isGuest = false,
}: LimitReachedModalProps) {
  if (!isOpen) return null;

  const formattedResetDate = resetsAt
    ? new Date(resetsAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-neutral-900/95 dark:bg-zinc-950/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-400 shadow-inner">
            <AlertCircle className="w-7 h-7" />
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-black tracking-tight text-white mb-2">
            Monthly Limit Reached
          </h3>

          <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-medium">
            {message ||
              (isGuest
                ? "Guest mode is limited to 1 free itinerary per month. Sign in to double your quota!"
                : "You have reached your limit of 2 free itineraries for this 30-day period.")}
          </p>

          {/* Resets At Pill */}
          {formattedResetDate && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300 mb-6">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Quota resets on:{" "}
                <strong className="text-white font-semibold">
                  {formattedResetDate}
                </strong>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {isGuest ? (
              <SignInButton mode="modal">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl py-3 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Sign In to Double Quota (2/mo)
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </SignInButton>
            ) : (
              <Button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 transition-all"
              >
                Got It
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl text-xs"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

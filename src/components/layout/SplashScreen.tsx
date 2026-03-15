"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
  return (
    <motion.div
      key="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[var(--color-primary-active)] via-[var(--color-primary)] to-[var(--color-primary-hover)] text-white"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, type: "spring", bounce: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse"></div>

          <div className="relative">
            <Image
              src="/icons/drop.png"
              alt="BoltEagle Merchant"
              width={120}
              height={120}
              className="w-30 h-30 drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        <div className="text-center space-y-2 mt-2">
          <h1 className="text-3xl font-black tracking-tighter">BoltEagle</h1>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">
            Master Dashboard
          </p>
        </div>
      </motion.div>

      {/* Loading Spinner / Indicator at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12"
      >
        <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

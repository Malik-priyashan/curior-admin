"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "./SplashScreen";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">{showSplash && <SplashScreen />}</AnimatePresence>
      {children}
    </>
  );
}

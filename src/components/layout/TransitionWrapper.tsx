"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useState } from "react";

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const [frozen] = useState(context);

  return (
    <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>
  );
}

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
        }}
        className="w-full min-h-full bg-slate-50"
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}

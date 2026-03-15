"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Storefront, Package, User, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: Storefront },
    { label: "Orders", href: "/orders", icon: Package },
    { label: "Services", href: "/curior-services", icon: Package },
    { label: "Account", href: "/account", icon: User },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 pb-safe-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.04)] h-[calc(80px+env(safe-area-inset-bottom))]"></div>

      <div className="relative w-full max-w-md mx-auto flex items-center justify-between px-6 h-[80px] mb-safe-bottom">
        <Link href="/orders/create" className="relative -top-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => triggerHaptic(30)}
            className="w-16 h-16 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center border-4 border-white active:rotate-3 transition-smooth hover:shadow-2xl"
          >
            <Plus weight="bold" className="text-3xl" />
          </motion.button>
        </Link>

        <div className="flex flex-1 justify-around items-center ml-4 bg-slate-100 rounded-2xl p-1 relative">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 relative"
                onClick={() => triggerHaptic(15)}
              >
                <div className="flex flex-col items-center justify-center h-12 relative z-10">
                  <Icon
                    weight={active ? "fill" : "bold"}
                    className={cn(
                      "text-2xl transition-all duration-300",
                      active ? "text-primary -translate-y-0.5" : "text-slate-400"
                    )}
                  />
                  {active && (
                    <span className="text-[10px] font-bold text-primary mt-0.5 animate-in fade-in slide-in-from-bottom-1">
                      {item.label}
                    </span>
                  )}
                </div>

                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-xl border border-slate-200/50"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

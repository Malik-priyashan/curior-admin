"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Storefront, Package, User, Plus, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";

const navItems = [
    { label: "Home", href: "/dashboard", icon: Storefront },
    { label: "Orders", href: "/orders", icon: Package },
    { label: "Curior Services", href: "/curior-services", icon: Package },
    { label: "Account", href: "/account", icon: User },
];

export function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0 z-40">
            <div className="p-6 h-20 flex items-center border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Storefront weight="fill" className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 tracking-tight">BoltEagle</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Merchant</p>
                    </div>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                <div className="px-2 mb-2">
                    <Link href="/orders/create" className="block w-full">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => triggerHaptic(30)}
                            className="w-full h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center gap-2 font-bold transition-smooth hover:shadow-xl"
                        >
                            <Plus weight="bold" className="text-xl" />
                            <span>New Order</span>
                        </motion.button>
                    </Link>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => triggerHaptic(15)}
                                className={cn(
                                    "group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300",
                                    active
                                        ? "bg-slate-100 text-primary"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        active ? "bg-white shadow-sm" : "bg-transparent group-hover:bg-white/50"
                                    )}>
                                        <Icon
                                            weight={active ? "fill" : "bold"}
                                            className="text-xl"
                                        />
                                    </div>
                                    <span className="font-semibold text-sm">{item.label}</span>
                                </div>
                                {active && (
                                    <motion.div layoutId="sidebar-active-indicator">
                                        <CaretRight weight="bold" className="text-xs opacity-50" />
                                    </motion.div>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                        <User weight="fill" className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">Merchant Account</p>
                        <p className="text-[10px] text-slate-400 font-medium">Eagle Express Partner</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

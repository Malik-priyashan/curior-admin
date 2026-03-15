"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { Storefront } from "@phosphor-icons/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden font-sans">
      {/* Visual Header */}
      <div className="h-[40dvh] w-full bg-gradient-to-br from-[var(--color-primary-active)] via-[var(--color-primary)] to-[var(--color-primary-hover)] flex flex-col items-center justify-center relative px-6 text-center text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-white blur-3xl rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-primary-active/50 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 space-y-4 animate-spring-in">
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-active/40 mx-auto">
            <Storefront weight="duotone" className="text-4xl text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tightest">Partner Portal</h1>
            <p className="text-[10px] uppercase font-black tracking-[0.4em] opacity-60">
              BoltEagle Logistics
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 -mt-10 bg-slate-50 relative z-20 rounded-t-[3rem] px-8 pt-10 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Curior Admin Login</h2>
            <p className="text-sm text-slate-500">Access your dashboard and look all details.</p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Footer / Help */}
      <footer className="py-8 bg-slate-50 px-8 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Version 1.2.5 • Secured by BoltEagle
        </p>
      </footer>
    </div>
  );
}

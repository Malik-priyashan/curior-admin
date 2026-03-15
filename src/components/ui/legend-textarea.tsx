"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export interface LegendTextareaProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  containerClassName?: string;
}

const LegendTextarea = React.forwardRef<HTMLTextAreaElement, LegendTextareaProps>(
  ({ label, className, containerClassName, ...props }, ref) => {
    return (
      <div className="relative group pt-2">
        <label
          className={cn(
            "absolute -top-0.5 left-3 bg-white px-1 text-[10px] font-bold uppercase tracking-wider z-10",
            "text-slate-400 group-hover:text-primary group-focus-within:text-primary",
            "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          )}
        >
          {label}
        </label>
        <div
          className={cn(
            "relative rounded-xl border-2 bg-white",
            "border-slate-200 hover:border-primary group-focus-within:border-primary",
            "group-focus-within:ring-4 group-focus-within:ring-primary/10",
            "shadow-sm hover:shadow-md group-focus-within:shadow-md",
            "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            containerClassName
          )}
        >
          <Textarea
            {...props}
            ref={ref}
            className={cn(
              "border-none bg-transparent min-h-[100px] rounded-xl px-4 py-3",
              "font-medium text-slate-800 placeholder:text-slate-300",
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none resize-none",
              "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              className
            )}
          />
        </div>
      </div>
    );
  }
);
LegendTextarea.displayName = "LegendTextarea";

export { LegendTextarea };

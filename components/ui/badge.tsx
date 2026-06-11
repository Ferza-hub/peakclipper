import { cn } from "@/lib/utils";
import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "violet";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-[#0f172a] text-white": variant === "default",
          "bg-[#f1f5f9] text-[#64748b]": variant === "secondary",
          "bg-green-100 text-green-700": variant === "success",
          "bg-amber-100 text-amber-700": variant === "warning",
          "bg-violet-100 text-violet-700": variant === "violet",
        },
        className
      )}
      {...props}
    />
  );
}

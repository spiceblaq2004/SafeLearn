import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-fg placeholder:text-muted/80",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine",
        className,
      )}
      {...props}
    />
  );
}

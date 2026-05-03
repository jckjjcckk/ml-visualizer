"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

type ResetButtonProps = {
  className?: string;
  disabled?: boolean;
  label?: string;
  onReset?: () => void;
};

export function ResetButton({
  className,
  disabled = false,
  label = "Reset",
  onReset,
}: ResetButtonProps) {
  return (
    <Tooltip content={disabled ? "Reset unavailable" : label}>
      <button
        type="button"
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-inset px-3 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:border-border-strong hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-[var(--text-muted)] disabled:opacity-70",
          className,
        )}
        disabled={disabled}
        onClick={onReset}
      >
        <RotateCcw aria-hidden="true" className="size-3.5" />
        {label}
      </button>
    </Tooltip>
  );
}

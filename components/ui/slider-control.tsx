"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type SliderControlProps = {
  className?: string;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
};

export function SliderControl({
  className,
  disabled = false,
  formatValue = (value) => String(value),
  label,
  max,
  min,
  onChange,
  step = 1,
  value,
}: SliderControlProps) {
  const id = useId();

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <label className="font-medium text-[var(--text-secondary)]" htmlFor={id}>
          {label}
        </label>
        <output
          className="shrink-0 rounded-full border border-border bg-inset px-2 py-0.5 font-medium text-[var(--text-primary)]"
          htmlFor={id}
        >
          {formatValue(value)}
        </output>
      </div>
      <input
        aria-valuetext={formatValue(value)}
        className="h-2 w-full cursor-pointer accent-prediction disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        id={id}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        step={step}
        type="range"
        value={value}
      />
    </div>
  );
}

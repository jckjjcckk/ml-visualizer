"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type PresetSelectorOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type PresetSelectorProps<TValue extends string> = {
  className?: string;
  disabled?: boolean;
  label: string;
  onChange: (value: TValue) => void;
  options: readonly PresetSelectorOption<TValue>[];
  value: TValue;
};

export function PresetSelector<TValue extends string>({
  className,
  disabled = false,
  label,
  onChange,
  options,
  value,
}: PresetSelectorProps<TValue>) {
  const id = useId();

  return (
    <div className={cn("min-w-0", className)}>
      <label
        className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        className="h-9 w-full rounded-md border border-border bg-inset px-3 text-sm font-medium text-[var(--text-primary)] transition-colors duration-150 hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-[var(--text-muted)] disabled:opacity-70"
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.currentTarget.value as TValue)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

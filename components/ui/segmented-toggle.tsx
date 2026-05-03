"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type SegmentedToggleOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SegmentedToggleProps<TValue extends string> = {
  className?: string;
  disabled?: boolean;
  label: string;
  onChange: (value: TValue) => void;
  options: readonly SegmentedToggleOption<TValue>[];
  value: TValue;
};

export function SegmentedToggle<TValue extends string>({
  className,
  disabled = false,
  label,
  onChange,
  options,
  value,
}: SegmentedToggleProps<TValue>) {
  const id = useId();
  const groupName = `${id}-group`;

  return (
    <fieldset className={cn("min-w-0", className)} disabled={disabled}>
      <legend className="mb-2 text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </legend>
      <div className="grid rounded-full border border-border bg-inset p-1">
        <div
          className="grid min-w-0 grid-cols-[repeat(var(--option-count),minmax(0,1fr))] gap-1"
          style={{ "--option-count": options.length } as CSSProperties}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <label
                key={option.value}
                className={cn(
                  "relative flex min-h-8 cursor-pointer items-center justify-center rounded-full px-2 text-center text-xs font-medium transition-colors duration-150",
                  isSelected
                    ? "bg-panel-raised text-[var(--text-primary)] shadow-[var(--shadow-soft)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  disabled && "cursor-not-allowed opacity-60",
                )}
              >
                <input
                  checked={isSelected}
                  className="sr-only"
                  name={groupName}
                  onChange={() => onChange(option.value)}
                  type="radio"
                  value={option.value}
                />
                <span className="truncate">{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}

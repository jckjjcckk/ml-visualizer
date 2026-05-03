"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TooltipProps = {
  children: ReactElement;
  content: string;
  side?: "top" | "bottom";
};

export function Tooltip({ children, content, side = "top" }: TooltipProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const trigger = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": isOpen ? tooltipId : undefined,
      } as HTMLAttributes<HTMLElement>)
    : children;

  return (
    <span
      className="relative inline-flex"
      onBlurCapture={() => setIsOpen(false)}
      onFocusCapture={() => setIsOpen(true)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {trigger}
      <AnimatePresence>
        {isOpen ? (
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-50 w-max max-w-48 -translate-x-1/2 rounded-md border border-border bg-panel-raised px-2.5 py-1.5 text-xs leading-4 text-[var(--text-secondary)] shadow-[var(--shadow-soft)]",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2",
            )}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            id={tooltipId}
            initial={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            role="tooltip"
            transition={{ duration: 0.14, ease: "easeOut" }}
          >
            {content}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

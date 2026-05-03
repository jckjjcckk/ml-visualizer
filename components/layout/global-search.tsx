"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  CircleDashed,
  CornerDownLeft,
  PlayCircle,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import type { CourseTool, CourseToolStatus } from "@/lib/course/catalog";
import { searchCourseTools } from "@/lib/course/search";

type GlobalSearchProps = {
  className?: string;
  tools: readonly CourseTool[];
};

const MAX_RESULTS = 8;

const getStatusStyles = (status: CourseToolStatus) => {
  if (status === "available") {
    return {
      icon: "text-success",
      label: "Available",
      pill: "border-success/35 bg-success/10 text-success",
    };
  }

  return {
    icon: "text-[var(--text-muted)]",
    label: "Soon",
    pill: "border-border bg-inset text-[var(--text-muted)]",
  };
};

export function GlobalSearch({ className, tools }: GlobalSearchProps) {
  const inputId = useId();
  const listboxId = useId();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchCourseTools(query, tools, MAX_RESULTS),
    [query, tools],
  );
  const normalizedQuery = query.trim();
  const activeResult =
    activeIndex >= 0 && activeIndex < results.length
      ? results[activeIndex]
      : null;
  const activeDescendant = activeResult
    ? `${listboxId}-option-${activeResult.tool.slug}`
    : undefined;

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const closeSearch = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleNavigate = (path: string) => {
    closeSearch();
    setQuery("");
    inputRef.current?.blur();
    router.push(path);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        closeSearch();
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((currentIndex) => {
        if (results.length === 0) {
          return -1;
        }

        return currentIndex < results.length - 1 ? currentIndex + 1 : 0;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((currentIndex) => {
        if (results.length === 0) {
          return -1;
        }

        return currentIndex > 0 ? currentIndex - 1 : results.length - 1;
      });
      return;
    }

    if (event.key === "Enter" && activeResult) {
      event.preventDefault();
      handleNavigate(activeResult.tool.path);
    }
  };

  return (
    <div
      className={cn("relative min-w-0 flex-1", className)}
      onBlurCapture={(event) => {
        const nextFocusTarget = event.relatedTarget;

        if (
          nextFocusTarget instanceof Node &&
          event.currentTarget.contains(nextFocusTarget)
        ) {
          return;
        }

        closeSearch();
      }}
      ref={containerRef}
    >
      <div className="flex h-10 min-w-0 items-center gap-2 rounded-full border border-border bg-panel-raised px-4 text-sm font-medium text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition-colors duration-150 hover:border-border-strong">
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <input
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label="Search course tools"
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] !outline-none placeholder:text-[var(--text-muted)] focus:!outline-none focus-visible:!outline-none"
          id={inputId}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => {
            setActiveIndex((currentIndex) =>
              currentIndex >= 0 ? currentIndex : results.length > 0 ? 0 : -1,
            );
            setIsOpen(true);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search tools"
          ref={inputRef}
          role="combobox"
          type="search"
          value={query}
        />
      </div>

      {isOpen && normalizedQuery.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-border bg-panel-raised shadow-[var(--shadow-panel)]">
          {results.length > 0 ? (
            <div
              aria-label="Search results"
              className="max-h-[min(28rem,calc(100vh-6rem))] overflow-y-auto p-2"
              id={listboxId}
              role="listbox"
            >
              {results.map(({ tool }, index) => {
                const isActive = index === activeIndex;
                const StatusIcon =
                  tool.status === "available" ? PlayCircle : CircleDashed;
                const styles = getStatusStyles(tool.status);

                return (
                  <Link
                    aria-selected={isActive}
                    className={cn(
                      "group flex min-w-0 items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                      isActive
                        ? "border-focus bg-focus-soft"
                        : "border-transparent hover:border-border hover:bg-inset",
                    )}
                    href={tool.path}
                    id={`${listboxId}-option-${tool.slug}`}
                    key={tool.path}
                    onClick={() => {
                      closeSearch();
                      setQuery("");
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    prefetch={false}
                    role="option"
                  >
                    <StatusIcon
                      aria-hidden="true"
                      className={cn("mt-0.5 size-4 shrink-0", styles.icon)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium leading-5 text-[var(--text-primary)]">
                        {tool.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs leading-4 text-[var(--text-muted)]">
                        Week {tool.week} / {tool.topic}
                      </span>
                      <span className="mt-1 block truncate text-xs leading-4 text-[var(--text-secondary)]">
                        {tool.summary}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium uppercase leading-4",
                        styles.pill,
                      )}
                    >
                      {styles.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-[var(--text-secondary)]">
              No matching course tools.
            </div>
          )}

          {results.length > 0 ? (
            <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2 text-[0.6875rem] uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              <span>Use arrows to browse</span>
              <span className="flex items-center gap-1">
                Enter
                <CornerDownLeft aria-hidden="true" className="size-3" />
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

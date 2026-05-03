import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  X,
} from "lucide-react";
import { GlobalSearch } from "@/components/layout/global-search";
import { ThemeToggle } from "@/components/ui";
import type { CourseTool } from "@/lib/course/catalog";

type TopBarProps = {
  isDesktopSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  onToggleDesktopSidebar: () => void;
  onToggleMobileSidebar: () => void;
  tools: readonly CourseTool[];
};

export function TopBar({
  isDesktopSidebarOpen,
  isMobileSidebarOpen,
  onToggleDesktopSidebar,
  onToggleMobileSidebar,
  tools,
}: TopBarProps) {
  const DesktopToggleIcon = isDesktopSidebarOpen
    ? PanelLeftClose
    : PanelLeftOpen;
  const MobileToggleIcon = isMobileSidebarOpen ? X : Menu;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-glass/85 backdrop-blur-[var(--blur-glass)]">
      <div className="flex min-h-16 w-full items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center">
          <button
            type="button"
            aria-controls="course-sidebar-mobile"
            aria-expanded={isMobileSidebarOpen}
            aria-label={
              isMobileSidebarOpen
                ? "Close course navigation"
                : "Open course navigation"
            }
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-panel-raised text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition-colors duration-150 hover:border-border-strong hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:hidden"
            onClick={onToggleMobileSidebar}
          >
            <MobileToggleIcon aria-hidden="true" className="size-4" />
          </button>

          <button
            type="button"
            aria-controls="course-sidebar-desktop"
            aria-expanded={isDesktopSidebarOpen}
            aria-label={
              isDesktopSidebarOpen
                ? "Hide course navigation"
                : "Show course navigation"
            }
            className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-border bg-panel-raised text-[var(--text-secondary)] shadow-[var(--shadow-soft)] transition-colors duration-150 hover:border-border-strong hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:flex"
            onClick={onToggleDesktopSidebar}
          >
            <DesktopToggleIcon aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-3 px-3 sm:w-64 sm:px-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border-strong bg-panel-raised shadow-[var(--shadow-soft)]">
            <Sparkles aria-hidden="true" className="size-4 text-prediction" />
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold leading-5 text-[var(--text-primary)]">
              ML Visualizer
            </p>
            <p className="truncate text-xs leading-4 text-[var(--text-muted)]">
              V0 course playground
            </p>
          </div>
        </div>

        <GlobalSearch tools={tools} />

        <div className="flex h-16 shrink-0 items-center gap-3 px-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

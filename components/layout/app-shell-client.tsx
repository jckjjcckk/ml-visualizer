"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CourseSidebar } from "@/components/layout/course-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import type { CourseTool, CourseWeekGroup } from "@/lib/course/catalog";

type AppShellClientProps = {
  children: React.ReactNode;
  courseGroups: readonly CourseWeekGroup[];
  tools: readonly CourseTool[];
};

export function AppShellClient({
  children,
  courseGroups,
  tools,
}: AppShellClientProps) {
  const pathname = usePathname();
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleDesktopSidebar={() =>
          setIsDesktopSidebarOpen((current) => !current)
        }
        onToggleMobileSidebar={() =>
          setIsMobileSidebarOpen((current) => !current)
        }
        tools={tools}
      />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside
          className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-hidden border-r border-border bg-panel/80 transition-[width,border-color] duration-200 ease-out md:block ${
            isDesktopSidebarOpen
              ? "w-80 border-border"
              : "w-0 border-transparent"
          }`}
        >
          <CourseSidebar
            id="course-sidebar-desktop"
            activePathname={pathname}
            groups={courseGroups}
          />
        </aside>

        <div
          className={`fixed inset-x-0 bottom-0 top-16 z-40 md:hidden ${
            isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <button
            type="button"
            aria-label="Close course navigation"
            className={`absolute inset-0 bg-background/75 backdrop-blur-sm transition-opacity duration-200 ${
              isMobileSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside
            className={`relative h-full w-80 max-w-[calc(100vw-2rem)] border-r border-border bg-panel shadow-[var(--shadow-panel)] transition-transform duration-200 ease-out ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <CourseSidebar
              id="course-sidebar-mobile"
              activePathname={pathname}
              groups={courseGroups}
              onNavigate={() => setIsMobileSidebarOpen(false)}
            />
          </aside>
        </div>

        <main className="flex min-w-0 flex-1 flex-col px-4 pb-4 pt-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

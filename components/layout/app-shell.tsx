import { AppShellClient } from "@/components/layout/app-shell-client";
import { COURSE_TOOLS, getCourseToolGroupsByWeek } from "@/lib/course/catalog";

export function AppShell({ children }: { children: React.ReactNode }) {
  const courseGroups = getCourseToolGroupsByWeek();

  return (
    <AppShellClient courseGroups={courseGroups} tools={COURSE_TOOLS}>
      {children}
    </AppShellClient>
  );
}

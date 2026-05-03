import Link from "next/link";
import { CircleDashed, PlayCircle } from "lucide-react";
import type {
  CourseTool,
  CourseToolStatus,
  CourseWeekGroup,
} from "@/lib/course/catalog";

type CourseSidebarProps = {
  activePathname: string;
  groups: readonly CourseWeekGroup[];
  id: string;
  onNavigate?: () => void;
};

const getToolCounts = (groups: readonly CourseWeekGroup[]) => {
  const tools = groups.flatMap((group) =>
    group.topics.flatMap((topic) => topic.tools),
  );

  return {
    available: tools.filter((tool) => tool.status === "available").length,
    total: tools.length,
  };
};

const getStatusStyles = (status: CourseToolStatus, isActive: boolean) => {
  if (status === "available") {
    return {
      badge:
        "border-success/35 bg-success/10 text-success group-hover:border-success/55",
      icon: "text-success",
      label: "Available",
      row: isActive
        ? "border-focus bg-focus-soft text-[var(--text-primary)]"
        : "border-transparent text-[var(--text-primary)] hover:border-border hover:bg-inset",
    };
  }

  return {
    badge:
      "border-border bg-inset text-[var(--text-muted)] group-hover:border-border-strong",
    icon: "text-[var(--text-muted)]",
    label: "Soon",
    row: isActive
      ? "border-focus bg-focus-soft text-[var(--text-primary)]"
      : "border-transparent text-[var(--text-secondary)] opacity-80 hover:border-border hover:bg-inset hover:opacity-100",
  };
};

function ToolLink({
  activePathname,
  onNavigate,
  tool,
}: {
  activePathname: string;
  onNavigate?: () => void;
  tool: CourseTool;
}) {
  const isActive = activePathname === tool.path;
  const styles = getStatusStyles(tool.status, isActive);
  const StatusIcon = tool.status === "available" ? PlayCircle : CircleDashed;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={`group flex min-h-12 items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${styles.row}`}
      href={tool.path}
      onClick={onNavigate}
      prefetch={false}
    >
      <StatusIcon
        aria-hidden="true"
        className={`mt-0.5 size-4 shrink-0 ${styles.icon}`}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium leading-5">
          {tool.title}
        </span>
        <span className="mt-0.5 block truncate text-xs leading-4 text-[var(--text-muted)]">
          {tool.summary}
        </span>
      </span>
      <span
        className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium uppercase leading-4 ${styles.badge}`}
      >
        {styles.label}
      </span>
    </Link>
  );
}

export function CourseSidebar({
  activePathname,
  groups,
  id,
  onNavigate,
}: CourseSidebarProps) {
  const counts = getToolCounts(groups);

  return (
    <nav
      aria-label="Course tools"
      className="flex h-full w-80 max-w-full flex-col bg-panel/95"
      id={id}
    >
      <div className="border-b border-border px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
          Course routes
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold leading-tight text-[var(--text-primary)]">
            Weeks 1-12
          </h2>
          <p className="shrink-0 text-xs font-medium text-[var(--text-muted)]">
            {counts.available} / {counts.total} live
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {groups.map((weekGroup) => (
            <section key={weekGroup.week} aria-labelledby={`week-${weekGroup.week}`}>
              <div className="mb-3 flex items-center gap-3 px-1">
                <h3
                  className="text-xs font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--text-secondary)]"
                  id={`week-${weekGroup.week}`}
                >
                  Week {weekGroup.week}
                </h3>
                <span className="h-px min-w-0 flex-1 bg-border" />
              </div>

              <div className="space-y-4">
                {weekGroup.topics.map((topicGroup) => (
                  <div key={`${weekGroup.week}-${topicGroup.topic}`}>
                    <p className="px-1 text-xs font-medium leading-4 text-[var(--text-muted)]">
                      {topicGroup.topic}
                    </p>
                    <div className="mt-1.5 space-y-1">
                      {topicGroup.tools.map((tool) => (
                        <ToolLink
                          key={tool.path}
                          activePathname={activePathname}
                          onNavigate={onNavigate}
                          tool={tool}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </nav>
  );
}

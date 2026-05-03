import type { CourseTool, CourseToolStatus } from "@/lib/course/catalog";

type ToolPageLayoutProps = {
  children: React.ReactNode;
  tool: CourseTool;
};

const getStatusStyles = (status: CourseToolStatus) => {
  if (status === "available") {
    return "border-success/35 bg-success/10 text-success";
  }

  return "border-border bg-inset text-[var(--text-muted)]";
};

export function ToolPageLayout({ children, tool }: ToolPageLayoutProps) {
  const plannedVisual =
    tool.plan === "N/A"
      ? "This course route is staged in the V0 catalog."
      : tool.plan;

  return (
    <article className="flex flex-1 flex-col gap-4">
      <header className="rounded-md border border-border bg-panel px-4 py-4 shadow-[var(--shadow-soft)] sm:px-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
          <span>Week {tool.week}</span>
          <span aria-hidden="true">/</span>
          <span>{tool.topic}</span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[0.6875rem] leading-4 ${getStatusStyles(
              tool.status,
            )}`}
          >
            {tool.status === "available" ? "Available" : "Coming soon"}
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold leading-tight text-[var(--text-primary)] sm:text-3xl">
              {tool.title}
            </h1>
            <p className="mt-3 text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Guided intro
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {tool.summary}
            </p>
          </div>
          <div className="rounded-md border border-border bg-inset px-3 py-2 lg:max-w-xs">
            <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Planned visual
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
              {plannedVisual}
            </p>
          </div>
        </div>
      </header>

      {children}
    </article>
  );
}

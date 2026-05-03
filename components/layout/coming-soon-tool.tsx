import { CircleDashed } from "lucide-react";
import { ToolWorkbenchLayout } from "@/components/layout/tool-workbench-layout";
import { ResetButton } from "@/components/ui";
import type { CourseTool } from "@/lib/course/catalog";

type ComingSoonToolProps = {
  tool: CourseTool;
};

export function ComingSoonTool({ tool }: ComingSoonToolProps) {
  const plannedVisual =
    tool.plan === "N/A"
      ? "A focused playground will be designed after the core V0 tooling is in place."
      : tool.plan;

  return (
    <ToolWorkbenchLayout
      controls={
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-inset p-4">
            <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Planned visual
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {plannedVisual}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 3 }, (_, index) => (
              <span
                key={index}
                className="h-2 rounded-full border border-border bg-inset"
              />
            ))}
          </div>
        </div>
      }
      outputSummary={
        <div>
          <div className="flex size-10 items-center justify-center rounded-md border border-border bg-inset">
            <CircleDashed
              aria-hidden="true"
              className="size-5 text-[var(--text-muted)]"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold leading-tight text-[var(--text-primary)]">
            {tool.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {tool.summary}
          </p>
        </div>
      }
      outputSummaryLabel="Coming soon"
      resetAction={<ResetButton disabled />}
      visualization={
        <div className="relative min-h-[24rem] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(var(--plot-grid)_1px,transparent_1px),linear-gradient(90deg,var(--plot-grid)_1px,transparent_1px)] bg-[size:42px_42px] opacity-70" />
          <div className="absolute left-8 top-8 h-24 w-px bg-border-strong" />
          <div className="absolute left-8 top-8 h-px w-28 bg-border-strong" />
          <div className="absolute left-[18%] top-[62%] size-4 rounded-full border-2 border-[var(--plot-point-stroke)] bg-class-a shadow-[0_8px_24px_#00000033]" />
          <div className="absolute left-[34%] top-[48%] size-4 rounded-full border-2 border-[var(--plot-point-stroke)] bg-class-b shadow-[0_8px_24px_#00000033]" />
          <div className="absolute left-[58%] top-[35%] size-4 rounded-full border-2 border-[var(--plot-point-stroke)] bg-class-c shadow-[0_8px_24px_#00000033]" />
          <div className="absolute left-[72%] top-[68%] size-4 rounded-full border-2 border-[var(--plot-point-stroke)] bg-class-d shadow-[0_8px_24px_#00000033]" />
          <div className="absolute inset-x-6 bottom-6 rounded-md border border-border bg-panel px-4 py-3 text-sm leading-6 text-[var(--text-secondary)] backdrop-blur-[var(--blur-glass)]">
            This route is reserved in the course map and will receive an
            interactive visualizer in a later V0 step.
          </div>
        </div>
      }
      visualizationLabel={`${tool.title} placeholder visualization`}
    />
  );
}

type ToolWorkbenchLayoutProps = {
  controls: React.ReactNode;
  controlsLabel?: string;
  header?: React.ReactNode;
  outputSummary: React.ReactNode;
  outputSummaryLabel?: string;
  resetAction?: React.ReactNode;
  visualization: React.ReactNode;
  visualizationLabel?: string;
};

export function ToolWorkbenchLayout({
  controls,
  controlsLabel = "Controls",
  header,
  outputSummary,
  outputSummaryLabel = "Current output",
  resetAction,
  visualization,
  visualizationLabel = "Visualization",
}: ToolWorkbenchLayoutProps) {
  return (
    <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-md border border-border bg-canvas shadow-[var(--shadow-panel)]">
      {header ? (
        <div className="border-b border-border bg-panel px-4 py-3 sm:px-5">
          {header}
        </div>
      ) : null}

      <div className="grid flex-1 gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <section
          aria-label={visualizationLabel}
          className="min-h-[24rem] min-w-0 overflow-hidden rounded-md border border-border bg-[var(--surface-inset)]"
        >
          {visualization}
        </section>

        <aside className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-1">
          <section
            aria-label={outputSummaryLabel}
            className="min-w-0 rounded-md border border-border bg-panel p-4"
          >
            <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              {outputSummaryLabel}
            </p>
            <div className="mt-3">{outputSummary}</div>
          </section>

          <section
            aria-label={controlsLabel}
            className="min-w-0 rounded-md border border-border bg-panel p-4"
          >
            <div className="flex min-h-8 items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
                {controlsLabel}
              </p>
              {resetAction ? (
                <div className="shrink-0">{resetAction}</div>
              ) : (
                <span aria-hidden="true" className="h-8 w-20 shrink-0" />
              )}
            </div>
            <div className="mt-4">{controls}</div>
          </section>
        </aside>
      </div>
    </section>
  );
}

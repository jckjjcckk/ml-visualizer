import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
      <div className="w-full max-w-2xl rounded-md border border-border bg-panel p-6 text-center shadow-[var(--shadow-panel)] sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-md border border-border bg-inset">
          <Compass
            aria-hidden="true"
            className="size-6 text-[var(--text-muted)]"
          />
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
          Route not found
        </p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight text-[var(--text-primary)] sm:text-3xl">
          This course tool is not in the V0 catalog.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
          Use the sidebar to open a registered week, topic, and tool route from
          the lecture-derived map.
        </p>
        <Link
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full border border-border-strong bg-panel-raised px-4 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition-colors duration-150 hover:border-focus hover:text-prediction focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          href="/"
        >
          Return to workbench
        </Link>
      </div>
    </section>
  );
}

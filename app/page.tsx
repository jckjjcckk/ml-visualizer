import { WorkbenchPreview } from "@/components/visualizers/workbench-preview";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section className="flex min-h-0 flex-1 flex-col">
        <WorkbenchPreview />
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoonTool } from "@/components/layout/coming-soon-tool";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { WorkbenchPreview } from "@/components/visualizers/workbench-preview";
import {
  COURSE_TOOLS,
  getCourseToolBySegments,
} from "@/lib/course/catalog";

type CourseRoutePageProps = {
  params: Promise<{
    topic: string;
    tool: string;
    week: string;
  }>;
};

export const dynamicParams = false;

const getRouteSegments = (path: string) => {
  const [week, topic, tool] = path.replace(/^\//, "").split("/");

  return {
    topic,
    tool,
    week,
  };
};

export function generateStaticParams() {
  return COURSE_TOOLS.map((tool) => getRouteSegments(tool.path));
}

export async function generateMetadata({
  params,
}: CourseRoutePageProps): Promise<Metadata> {
  const { topic, tool, week } = await params;
  const courseTool = getCourseToolBySegments(week, topic, tool);

  if (!courseTool) {
    return {
      title: "Tool not found",
    };
  }

  return {
    title: `${courseTool.title} | ML Visualizer`,
    description: courseTool.summary,
  };
}

export default async function CourseRoutePage({ params }: CourseRoutePageProps) {
  const { topic, tool, week } = await params;
  const courseTool = getCourseToolBySegments(week, topic, tool);

  if (!courseTool) {
    notFound();
  }

  return (
    <ToolPageLayout tool={courseTool}>
      {courseTool.status === "available" ? (
        <WorkbenchPreview heading={courseTool.title} statusLabel="Route ready" />
      ) : (
        <ComingSoonTool tool={courseTool} />
      )}
    </ToolPageLayout>
  );
}

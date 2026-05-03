"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";
import { cn } from "@/lib/utils";
import {
  createPlotTransform,
  DEFAULT_PLOT_MARGIN,
} from "@/components/plots/scales";
import type {
  PlotBounds,
  PlotDomain,
  PlotMargin,
  PlotTransform,
} from "@/components/plots/types";

export type ResponsivePlotRenderContext = {
  bounds: PlotBounds;
  transform: PlotTransform;
};

export type ResponsivePlotProps = {
  ariaLabel: string;
  children:
    | ReactNode
    | ((context: ResponsivePlotRenderContext) => ReactNode);
  className?: string;
  domain: PlotDomain;
  fallbackWidth?: number;
  margin?: PlotMargin;
  maxHeight?: number;
  minHeight?: number;
  minWidth?: number;
  svgProps?: Omit<SVGProps<SVGSVGElement>, "children" | "height" | "width">;
  xTickCount?: number;
  yTickCount?: number;
};

export function ResponsivePlot({
  ariaLabel,
  children,
  className,
  domain,
  fallbackWidth = 720,
  margin = DEFAULT_PLOT_MARGIN,
  maxHeight,
  minHeight = 384,
  minWidth = 320,
  svgProps,
  xTickCount = 6,
  yTickCount = 5,
}: ResponsivePlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({
    height: minHeight,
    width: fallbackWidth,
  });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = Math.max(minWidth, Math.round(entry.contentRect.width));
      const measuredHeight = Math.round(entry.contentRect.height);
      const nextHeight = Math.max(
        minHeight,
        maxHeight ? Math.min(maxHeight, measuredHeight) : measuredHeight,
      );

      setSize((currentSize) =>
        currentSize.width === nextWidth && currentSize.height === nextHeight
          ? currentSize
          : {
              height: nextHeight,
              width: nextWidth,
            },
      );
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [maxHeight, minHeight, minWidth]);

  const transform = useMemo(
    () =>
      createPlotTransform({
        domain,
        height: size.height,
        margin,
        width: size.width,
        xTickCount,
        yTickCount,
      }),
    [domain, margin, size.height, size.width, xTickCount, yTickCount],
  );

  const renderedChildren =
    typeof children === "function"
      ? children({ bounds: transform.bounds, transform })
      : children;

  return (
    <div
      className={cn("relative h-full w-full min-w-0 overflow-hidden", className)}
      ref={containerRef}
      style={{
        maxHeight,
        minHeight,
      }}
    >
      <svg
        aria-label={ariaLabel}
        className="block size-full"
        preserveAspectRatio="none"
        role="img"
        viewBox={`0 0 ${transform.bounds.width} ${transform.bounds.height}`}
        {...svgProps}
      >
        {renderedChildren}
      </svg>
    </div>
  );
}

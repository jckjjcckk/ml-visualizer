import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import type {
  PlotBounds,
  PlotLabelDatum,
  PlotLegendItem,
  PlotLineDatum,
  PlotPointDatum,
  PlotRegionDatum,
  PlotSegmentDatum,
  PlotTransform,
} from "@/components/plots/types";

type PlotPrimitiveProps = {
  className?: string;
  transform: PlotTransform;
};

export function PlotGrid({ className, transform }: PlotPrimitiveProps) {
  const { bounds, xTicks, yTicks } = transform;
  const plotBottom = bounds.height - bounds.margin.bottom;
  const plotRight = bounds.width - bounds.margin.right;

  return (
    <g
      aria-hidden="true"
      className={cn("stroke-plot-grid opacity-80", className)}
      strokeWidth={1}
    >
      {xTicks.map((tick) => {
        const x = transform.xScale(tick);

        return (
          <line
            key={`x-grid-${tick}`}
            x1={x}
            x2={x}
            y1={bounds.margin.top}
            y2={plotBottom}
          />
        );
      })}
      {yTicks.map((tick) => {
        const y = transform.yScale(tick);

        return (
          <line
            key={`y-grid-${tick}`}
            x1={bounds.margin.left}
            x2={plotRight}
            y1={y}
            y2={y}
          />
        );
      })}
    </g>
  );
}

type PlotAxesProps = PlotPrimitiveProps & {
  showTickLabels?: boolean;
  xLabel?: string;
  yLabel?: string;
};

export function PlotAxes({
  className,
  showTickLabels = true,
  transform,
  xLabel,
  yLabel,
}: PlotAxesProps) {
  const { bounds, xTicks, yTicks } = transform;
  const plotBottom = bounds.height - bounds.margin.bottom;
  const plotRight = bounds.width - bounds.margin.right;

  return (
    <g className={className}>
      <g className="stroke-plot-axis" strokeWidth={1.25}>
        <line
          x1={bounds.margin.left}
          x2={plotRight}
          y1={plotBottom}
          y2={plotBottom}
        />
        <line
          x1={bounds.margin.left}
          x2={bounds.margin.left}
          y1={bounds.margin.top}
          y2={plotBottom}
        />
      </g>
      {xTicks.map((tick) => {
        const x = transform.xScale(tick);

        return (
          <g key={`x-axis-${tick}`} transform={`translate(${x}, ${plotBottom})`}>
            <line className="stroke-plot-axis" y2={5} />
            {showTickLabels ? (
              <text
                className="fill-plot-tick text-[10px]"
                dy="1.35em"
                textAnchor="middle"
              >
                {tick}
              </text>
            ) : null}
          </g>
        );
      })}
      {yTicks.map((tick) => {
        const y = transform.yScale(tick);

        return (
          <g key={`y-axis-${tick}`} transform={`translate(${bounds.margin.left}, ${y})`}>
            <line className="stroke-plot-axis" x2={-5} />
            {showTickLabels ? (
              <text
                className="fill-plot-tick text-[10px]"
                dx="-0.7em"
                dy="0.32em"
                textAnchor="end"
              >
                {tick}
              </text>
            ) : null}
          </g>
        );
      })}
      {xLabel ? (
        <text
          className="fill-[var(--text-muted)] text-[11px] font-medium"
          x={(bounds.margin.left + plotRight) / 2}
          y={bounds.height - 13}
          textAnchor="middle"
        >
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text
          className="fill-[var(--text-muted)] text-[11px] font-medium"
          textAnchor="middle"
          transform={`translate(14, ${(bounds.margin.top + plotBottom) / 2}) rotate(-90)`}
        >
          {yLabel}
        </text>
      ) : null}
    </g>
  );
}

type PlotRegionsProps = PlotPrimitiveProps & {
  regions: readonly PlotRegionDatum[];
};

export function PlotRegions({ className, regions, transform }: PlotRegionsProps) {
  return (
    <g className={className}>
      {regions.map((region) => {
        if (region.kind === "polygon") {
          const points = region.points
            .map((point) => {
              const screen = transform.toScreen(point);

              return `${screen.x},${screen.y}`;
            })
            .join(" ");

          return (
            <polygon
              key={region.id}
              fill={region.fill ?? "var(--plot-region)"}
              opacity={region.opacity ?? 0.18}
              points={points}
              stroke={region.stroke ?? "transparent"}
            />
          );
        }

        const topLeft = transform.toScreen({ x: region.x0, y: region.y1 });
        const bottomRight = transform.toScreen({ x: region.x1, y: region.y0 });

        return (
          <rect
            key={region.id}
            fill={region.fill ?? "var(--plot-region)"}
            height={Math.abs(bottomRight.y - topLeft.y)}
            opacity={region.opacity ?? 0.18}
            stroke={region.stroke ?? "transparent"}
            width={Math.abs(bottomRight.x - topLeft.x)}
            x={Math.min(topLeft.x, bottomRight.x)}
            y={Math.min(topLeft.y, bottomRight.y)}
          />
        );
      })}
    </g>
  );
}

type PlotSegmentsProps = PlotPrimitiveProps & {
  segments: readonly PlotSegmentDatum[];
};

export function PlotSegments({ className, segments, transform }: PlotSegmentsProps) {
  return (
    <g className={className}>
      {segments.map((segment) => {
        const start = transform.toScreen({ x: segment.x1, y: segment.y1 });
        const end = transform.toScreen({ x: segment.x2, y: segment.y2 });

        return (
          <line
            key={segment.id}
            stroke={segment.stroke ?? "var(--split)"}
            strokeDasharray={segment.strokeDasharray}
            strokeLinecap="round"
            strokeWidth={segment.strokeWidth ?? 2}
            x1={start.x}
            x2={end.x}
            y1={start.y}
            y2={end.y}
          />
        );
      })}
    </g>
  );
}

type PlotLinesProps = PlotPrimitiveProps & {
  lines: readonly PlotLineDatum[];
};

export function PlotLines({ className, lines, transform }: PlotLinesProps) {
  return (
    <g className={className}>
      {lines.map((line) => {
        const points = line.points
          .map((point) => {
            const screen = transform.toScreen(point);

            return `${screen.x},${screen.y}`;
          })
          .join(" ");

        return (
          <polyline
            key={line.id}
            fill="none"
            points={points}
            stroke={line.stroke ?? "var(--prediction)"}
            strokeDasharray={line.strokeDasharray}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={line.strokeWidth ?? 2.5}
          />
        );
      })}
    </g>
  );
}

type PlotPointSeriesProps = PlotPrimitiveProps & {
  getPointProps?: (
    point: PlotPointDatum,
  ) => SVGProps<SVGCircleElement> | undefined;
  points: readonly PlotPointDatum[];
};

export function PlotPointSeries({
  className,
  getPointProps,
  points,
  transform,
}: PlotPointSeriesProps) {
  return (
    <g className={className}>
      {points.map((point) => {
        const screen = transform.toScreen(point);
        const pointProps = getPointProps?.(point);

        return (
          <circle
            key={point.id}
            aria-label={point.ariaLabel ?? point.label}
            cx={screen.x}
            cy={screen.y}
            fill={point.fill ?? "var(--prediction)"}
            r={point.radius ?? 6}
            stroke={point.stroke ?? "var(--plot-point-stroke)"}
            strokeWidth={2}
            {...pointProps}
            className={cn(
              "drop-shadow-[0_8px_18px_#00000033]",
              pointProps?.className,
            )}
          />
        );
      })}
    </g>
  );
}

type PlotLabelsProps = PlotPrimitiveProps & {
  labels: readonly PlotLabelDatum[];
};

export function PlotLabels({ className, labels, transform }: PlotLabelsProps) {
  return (
    <g className={className}>
      {labels.map((label) => {
        const screen = transform.toScreen(label);
        const width = label.width ?? Math.max(48, label.text.length * 7 + 18);
        const height = 24;
        const offsetX = label.offsetX ?? 0;
        const offsetY = label.offsetY ?? 0;
        const x =
          label.anchor === "end"
            ? screen.x - width + offsetX
            : label.anchor === "middle"
              ? screen.x - width / 2 + offsetX
              : screen.x + offsetX;
        const y = screen.y - height / 2 + offsetY;

        return (
          <g key={label.id} transform={`translate(${x}, ${y})`}>
            <rect
              fill={label.fill ?? "var(--surface-panel-raised)"}
              height={height}
              rx={12}
              stroke="var(--border-strong)"
              width={width}
            />
            <text
              className="text-[11px] font-medium"
              fill={label.textColor ?? "var(--text-secondary)"}
              textAnchor="middle"
              x={width / 2}
              y={height / 2 + 4}
            >
              {label.text}
            </text>
          </g>
        );
      })}
    </g>
  );
}

type PlotLegendProps = {
  bounds: PlotBounds;
  className?: string;
  height?: number;
  items: readonly PlotLegendItem[];
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  width?: number;
};

export function PlotLegend({
  bounds,
  className,
  height = 42,
  items,
  position = "bottom-left",
  width,
}: PlotLegendProps) {
  const legendWidth = Math.min(width ?? 340, bounds.innerWidth);
  const isRight = position.endsWith("right");
  const isBottom = position.startsWith("bottom");
  const x = isRight
    ? bounds.width - bounds.margin.right - legendWidth
    : bounds.margin.left;
  const y = isBottom
    ? bounds.height - bounds.margin.bottom - height - 8
    : bounds.margin.top + 8;

  return (
    <foreignObject height={height} width={legendWidth} x={x} y={y}>
      <div
        className={cn(
          "flex h-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border bg-panel/95 px-3 py-2 text-xs text-[var(--text-secondary)] backdrop-blur-[var(--blur-glass)]",
          className,
        )}
      >
        {items.map((item) => (
          <span
            key={item.id ?? item.label}
            className="flex min-w-0 items-center gap-1.5"
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: item.color }}
            />
            <span className="truncate">{item.label}</span>
          </span>
        ))}
      </div>
    </foreignObject>
  );
}

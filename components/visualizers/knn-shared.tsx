"use client";

import { useMemo } from "react";
import {
  PlotAxes,
  PlotGrid,
  PlotLabels,
  PlotLegend,
  PlotPointSeries,
  PlotRegions,
  PlotSegments,
  ResponsivePlot,
  createKeyboardNudgeHandler,
  getPointerDataPoint,
  startPlotDrag,
  type PlotDomain,
  type PlotLegendItem,
  type PlotPointDatum,
  type PlotRegionDatum,
  type PlotSegmentDatum,
} from "@/components/plots";
import type {
  ClassificationDataset2D,
  ClassificationSample2D,
  DatasetClass,
} from "@/lib/datasets";
import {
  calculateZScoreStats2D,
  normalizePointWithZScore,
  predictKnnClass,
  type KnnDistanceMetric,
  type KnnPoint2D,
  type KnnPredictionResult,
  type KnnSample2D,
} from "@/lib/algorithms";

export const KNN_DISTANCE_OPTIONS = [
  { label: "Euclidean", value: "euclidean" },
  { label: "Manhattan", value: "manhattan" },
  { label: "Cosine", value: "cosine" },
] as const;

export type KnnDistanceOption = (typeof KNN_DISTANCE_OPTIONS)[number]["value"];

export type KnnPlotSample = KnnSample2D & {
  displayLabel?: string;
};

type KnnPlot2DProps = {
  ariaLabel: string;
  classes: readonly DatasetClass[];
  decisionRegions?: readonly PlotRegionDatum[];
  domain: PlotDomain;
  margin?: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  onQueryChange: (query: KnnPoint2D) => void;
  prediction: KnnPredictionResult<KnnPlotSample>;
  query: KnnPoint2D;
  samples: readonly KnnPlotSample[];
  subtitle?: string;
  title?: string;
  xLabel: string;
  yLabel: string;
};

export function getClassColor(
  classes: readonly DatasetClass[],
  classLabel: string | null,
) {
  return (
    classes.find((datasetClass) => datasetClass.label === classLabel)
      ?.colorToken ?? "var(--prediction)"
  );
}

export function getClassName(
  classes: readonly DatasetClass[],
  classLabel: string | null,
) {
  return (
    classes.find((datasetClass) => datasetClass.label === classLabel)?.name ??
    classLabel ??
    "Unassigned"
  );
}

export function getDefaultK(dataset: ClassificationDataset2D) {
  const k = dataset.defaultSettings?.k;

  return typeof k === "number" ? k : 3;
}

export function getDefaultMetric(dataset: ClassificationDataset2D) {
  const metric = dataset.defaultSettings?.metric;

  if (metric === "cosine" || metric === "manhattan") {
    return metric;
  }

  return "euclidean";
}

export function getDefaultQuery(dataset: ClassificationDataset2D): KnnPoint2D {
  return dataset.defaultQuery ?? {
    x: (dataset.domain.x[0] + dataset.domain.x[1]) / 2,
    y: (dataset.domain.y[0] + dataset.domain.y[1]) / 2,
  };
}

export function denormalizePointWithZScore(
  point: KnnPoint2D,
  stats: ReturnType<typeof calculateZScoreStats2D>,
): KnnPoint2D {
  return {
    x: point.x * stats.standardDeviation.x + stats.mean.x,
    y: point.y * stats.standardDeviation.y + stats.mean.y,
  };
}

export function getNormalizedDomain(
  domain: PlotDomain,
  stats: ReturnType<typeof calculateZScoreStats2D>,
): PlotDomain {
  const min = normalizePointWithZScore(
    { x: domain.x[0], y: domain.y[0] },
    stats,
  );
  const max = normalizePointWithZScore(
    { x: domain.x[1], y: domain.y[1] },
    stats,
  );

  return {
    x: [Math.min(min.x, max.x), Math.max(min.x, max.x)],
    y: [Math.min(min.y, max.y), Math.max(min.y, max.y)],
  };
}

export function formatValue(value: number, digits = 2) {
  if (Math.abs(value) >= 100) {
    return value.toFixed(0);
  }

  return value.toFixed(digits).replace(/\.?0+$/, "");
}

export function getDatasetClassOrder(dataset: ClassificationDataset2D) {
  return dataset.classes.map((datasetClass) => datasetClass.label);
}

export function createDecisionRegions({
  classOrder,
  classes,
  domain,
  gridSize = 28,
  k,
  metric,
  normalize = false,
  samples,
}: {
  classOrder: readonly string[];
  classes: readonly DatasetClass[];
  domain: PlotDomain;
  gridSize?: number;
  k: number;
  metric: KnnDistanceMetric;
  normalize?: boolean;
  samples: readonly ClassificationSample2D[];
}): readonly PlotRegionDatum[] {
  const xStep = (domain.x[1] - domain.x[0]) / gridSize;
  const yStep = (domain.y[1] - domain.y[0]) / gridSize;
  const regions: PlotRegionDatum[] = [];

  for (let xIndex = 0; xIndex < gridSize; xIndex += 1) {
    for (let yIndex = 0; yIndex < gridSize; yIndex += 1) {
      const x0 = domain.x[0] + xIndex * xStep;
      const y0 = domain.y[0] + yIndex * yStep;
      const query = {
        x: x0 + xStep / 2,
        y: y0 + yStep / 2,
      };
      const prediction = predictKnnClass({
        classOrder,
        k,
        metric,
        normalize,
        query,
        samples,
      });

      regions.push({
        fill: getClassColor(classes, prediction.predictedClassLabel),
        id: `region-${xIndex}-${yIndex}`,
        kind: "rect",
        opacity: 0.11,
        x0,
        x1: x0 + xStep,
        y0,
        y1: y0 + yStep,
      });
    }
  }

  return regions;
}

export function KnnPlot2D({
  ariaLabel,
  classes,
  decisionRegions = [],
  domain,
  margin = { bottom: 52, left: 54, right: 24, top: 30 },
  onQueryChange,
  prediction,
  query,
  samples,
  subtitle,
  title,
  xLabel,
  yLabel,
}: KnnPlot2DProps) {
  const neighborIds = useMemo(
    () => new Set(prediction.neighbors.map((neighbor) => neighbor.sample.id)),
    [prediction.neighbors],
  );
  const predictedColor = getClassColor(classes, prediction.predictedClassLabel);
  const points: PlotPointDatum[] = samples.map((sample) => {
    const isNeighbor = neighborIds.has(sample.id);

    return {
      ariaLabel: `${sample.displayLabel ?? sample.classLabel} sample at ${formatValue(
        sample.x,
      )}, ${formatValue(sample.y)}`,
      fill: getClassColor(classes, sample.classLabel),
      id: sample.id,
      label: sample.displayLabel ?? sample.classLabel,
      radius: isNeighbor ? 7.5 : 5.5,
      stroke: isNeighbor ? "var(--neighbor)" : "var(--plot-point-stroke)",
      x: sample.x,
      y: sample.y,
    };
  });
  const neighborSegments: PlotSegmentDatum[] = prediction.neighbors.map(
    (neighbor) => ({
      id: `neighbor-line-${neighbor.sample.id}`,
      stroke: "var(--neighbor)",
      strokeDasharray: neighbor.rank === 1 ? undefined : "4 5",
      strokeWidth: neighbor.rank === 1 ? 2.5 : 1.6,
      x1: query.x,
      x2: neighbor.sample.x,
      y1: query.y,
      y2: neighbor.sample.y,
    }),
  );
  const legend: readonly PlotLegendItem[] = [
    ...classes.map((datasetClass) => ({
      color: datasetClass.colorToken,
      id: datasetClass.label,
      label: datasetClass.name,
    })),
    {
      color: "var(--neighbor)",
      id: "neighbors",
      label: `${prediction.effectiveK} nearest`,
    },
  ];
  const xStep = (domain.x[1] - domain.x[0]) / 80;
  const yStep = (domain.y[1] - domain.y[0]) / 80;

  return (
    <div className="relative h-full min-h-[24rem] min-w-0">
      {title ? (
        <div className="absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-md border border-border bg-panel/95 px-3 py-2 backdrop-blur-[var(--blur-glass)]">
          <p className="truncate text-xs font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--text-secondary)]">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      <ResponsivePlot
        ariaLabel={ariaLabel}
        className="min-h-[24rem]"
        domain={domain}
        margin={margin}
      >
        {({ bounds, transform }) => {
          const plotLeft = bounds.margin.left;
          const plotTop = bounds.margin.top;
          const plotWidth = bounds.width - bounds.margin.left - bounds.margin.right;
          const plotHeight =
            bounds.height - bounds.margin.top - bounds.margin.bottom;

          return (
            <>
              <PlotGrid transform={transform} />
              <PlotRegions regions={decisionRegions} transform={transform} />
              <PlotSegments
                className="opacity-80"
                segments={neighborSegments}
                transform={transform}
              />
              <PlotAxes transform={transform} xLabel={xLabel} yLabel={yLabel} />
              <rect
                aria-hidden="true"
                className="cursor-crosshair"
                fill="transparent"
                height={plotHeight}
                onPointerDown={(event) => {
                  const point = getPointerDataPoint(event, transform);

                  if (point) {
                    onQueryChange(transform.clamp(point));
                  }
                }}
                width={plotWidth}
                x={plotLeft}
                y={plotTop}
              />
              <PlotPointSeries points={points} transform={transform} />
              <PlotPointSeries
                getPointProps={() => ({
                  className:
                    "cursor-grab outline-none transition-[r,stroke-width] duration-150 focus-visible:stroke-focus active:cursor-grabbing",
                  onKeyDown: createKeyboardNudgeHandler({
                    domain,
                    onNudge: onQueryChange,
                    point: query,
                    step: { x: xStep, y: yStep },
                  }),
                  onPointerDown: (event) => {
                    event.stopPropagation();
                    startPlotDrag(event, transform, {
                      onDrag: (point) => onQueryChange(transform.clamp(point)),
                    });
                  },
                  role: "slider",
                  tabIndex: 0,
                })}
                points={[
                  {
                    ariaLabel: `Query point, predicted ${getClassName(
                      classes,
                      prediction.predictedClassLabel,
                    )}`,
                    fill: predictedColor,
                    id: "query",
                    label: "Query",
                    radius: 9,
                    stroke: "var(--prediction)",
                    x: query.x,
                    y: query.y,
                  },
                ]}
                transform={transform}
              />
              <PlotLabels
                labels={[
                  {
                    anchor: "start",
                    fill: "var(--surface-panel-raised)",
                    id: "query-label",
                    offsetX: 12,
                    offsetY: -18,
                    text: getClassName(classes, prediction.predictedClassLabel),
                    textColor: "var(--text-primary)",
                    width: 112,
                    x: query.x,
                    y: query.y,
                  },
                ]}
                transform={transform}
              />
              <PlotLegend bounds={bounds} items={legend} position="bottom-left" />
            </>
          );
        }}
      </ResponsivePlot>
    </div>
  );
}

export function VoteBreakdown({
  classes,
  prediction,
}: {
  classes: readonly DatasetClass[];
  prediction: KnnPredictionResult;
}) {
  if (prediction.votes.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        No neighbors are available.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {prediction.votes.map((vote) => (
        <div key={vote.classLabel}>
          <div className="flex items-center justify-between gap-3 text-xs font-medium">
            <span className="flex min-w-0 items-center gap-2 text-[var(--text-secondary)]">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: getClassColor(classes, vote.classLabel) }}
              />
              <span className="truncate">
                {getClassName(classes, vote.classLabel)}
              </span>
            </span>
            <span className="shrink-0 text-[var(--text-primary)]">
              {vote.count}
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-inset">
            <div
              className="h-full rounded-full bg-neighbor"
              style={{
                width: `${Math.max(
                  5,
                  (vote.count / prediction.effectiveK) * 100,
                )}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NeighborList({
  classes,
  neighbors,
}: {
  classes: readonly DatasetClass[];
  neighbors: KnnPredictionResult["neighbors"];
}) {
  return (
    <ol className="space-y-2">
      {neighbors.map((neighbor) => (
        <li
          className="flex items-center justify-between gap-3 rounded-md border border-border bg-inset px-3 py-2 text-xs"
          key={neighbor.sample.id}
        >
          <span className="flex min-w-0 items-center gap-2 text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-muted)]">
              #{neighbor.rank}
            </span>
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{
                background: getClassColor(classes, neighbor.sample.classLabel),
              }}
            />
            <span className="truncate">
              {getClassName(classes, neighbor.sample.classLabel)}
            </span>
          </span>
          <span className="font-medium text-[var(--text-primary)]">
            {formatValue(neighbor.distance, 3)}
          </span>
        </li>
      ))}
    </ol>
  );
}

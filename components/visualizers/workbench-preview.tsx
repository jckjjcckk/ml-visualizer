"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolWorkbenchLayout } from "@/components/layout/tool-workbench-layout";
import {
  PlotAxes,
  PlotGrid,
  PlotLabels,
  PlotLegend,
  PlotPointSeries,
  PlotRegions,
  PlotSegments,
  ResponsivePlot,
  type PlotDomain,
  type PlotLegendItem,
  type PlotPointDatum,
  type PlotRegionDatum,
  type PlotSegmentDatum,
} from "@/components/plots";
import {
  PlayControls,
  PresetSelector,
  ResetButton,
  SegmentedToggle,
  SliderControl,
} from "@/components/ui";

const PREVIEW_DOMAIN: PlotDomain = {
  x: [0, 10],
  y: [0, 10],
};

const previewPoints: readonly PlotPointDatum[] = [
  { fill: "var(--class-a)", id: "a-1", label: "Class A", x: 1.8, y: 3.2 },
  { fill: "var(--class-a)", id: "a-2", label: "Class A", x: 2.7, y: 4.6 },
  { fill: "var(--class-a)", id: "a-3", label: "Class A", x: 3.4, y: 2.8 },
  { fill: "var(--class-b)", id: "b-1", label: "Class B", x: 4.3, y: 6.2 },
  { fill: "var(--class-b)", id: "b-2", label: "Class B", x: 5.6, y: 5.1 },
  { fill: "var(--class-b)", id: "b-3", label: "Class B", x: 6.6, y: 7.2 },
  { fill: "var(--class-c)", id: "c-1", label: "Class C", x: 7.2, y: 3.8 },
  { fill: "var(--class-c)", id: "c-2", label: "Class C", x: 8.2, y: 5.6 },
];

type WorkbenchPreviewProps = {
  heading?: string;
  statusLabel?: string;
};

const metricOptions = [
  { label: "Euclidean", value: "euclidean" },
  { label: "Manhattan", value: "manhattan" },
] as const;

const presetOptions = [
  { label: "Compact clusters", value: "compact" },
  { label: "Noisy boundary", value: "noisy" },
  { label: "Diagonal split", value: "diagonal" },
] as const;

type DistanceMetric = (typeof metricOptions)[number]["value"];
type PreviewPreset = (typeof presetOptions)[number]["value"];

const DEFAULT_DEPTH = 2;
const DEFAULT_METRIC: DistanceMetric = "euclidean";
const DEFAULT_PRESET: PreviewPreset = "compact";
const DEFAULT_SPLIT_STEP = 3;
const MAX_SPLIT_STEP = 5;

export function WorkbenchPreview({
  heading = "Decision tree split preview",
  statusLabel = "Shell ready",
}: WorkbenchPreviewProps) {
  const [depth, setDepth] = useState(DEFAULT_DEPTH);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metric, setMetric] = useState<DistanceMetric>(DEFAULT_METRIC);
  const [preset, setPreset] = useState<PreviewPreset>(DEFAULT_PRESET);
  const [splitStep, setSplitStep] = useState(DEFAULT_SPLIT_STEP);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSplitStep((currentStep) =>
        currentStep >= MAX_SPLIT_STEP ? 1 : currentStep + 1,
      );
    }, 900);

    return () => window.clearInterval(intervalId);
  }, [isPlaying]);

  const splitPercent = 34 + splitStep * 4 + depth;
  const branchPercent = 45 + splitStep;
  const splitX = splitPercent / 10;
  const branchY = 10 - branchPercent / 10;
  const prediction = metric === "manhattan" && preset === "noisy" ? "Class B" : "Class A";
  const presetLabel = useMemo(
    () =>
      presetOptions.find((option) => option.value === preset)?.label ??
      "Compact clusters",
    [preset],
  );
  const metricLabel =
    metricOptions.find((option) => option.value === metric)?.label ?? "Euclidean";
  const previewRegions: readonly PlotRegionDatum[] = useMemo(
    () => [
      {
        fill: "var(--class-a)",
        id: "left-leaf",
        kind: "rect",
        opacity: 0.12,
        x0: 0,
        x1: splitX,
        y0: 0,
        y1: 10,
      },
      {
        fill: "var(--class-b)",
        id: "upper-right-leaf",
        kind: "rect",
        opacity: 0.12,
        x0: splitX,
        x1: 10,
        y0: branchY,
        y1: 10,
      },
      {
        fill: "var(--class-c)",
        id: "lower-right-leaf",
        kind: "rect",
        opacity: 0.12,
        x0: splitX,
        x1: 10,
        y0: 0,
        y1: branchY,
      },
    ],
    [branchY, splitX],
  );
  const previewSegments: readonly PlotSegmentDatum[] = useMemo(
    () => [
      {
        id: "primary-split",
        stroke: "var(--split)",
        strokeWidth: 2.5,
        x1: splitX,
        x2: splitX,
        y1: 0,
        y2: 10,
      },
      {
        id: "branch-split",
        stroke: "var(--split)",
        strokeWidth: 2.5,
        x1: splitX,
        x2: 10,
        y1: branchY,
        y2: branchY,
      },
    ],
    [branchY, splitX],
  );
  const previewLegend: readonly PlotLegendItem[] = useMemo(
    () => [
      {
        color: "var(--class-a)",
        id: "left-leaf",
        label: `Left leaf: ${depth + 1} class A points`,
      },
      {
        color: "var(--split)",
        id: "metric",
        label: `${metricLabel} preview`,
      },
    ],
    [depth, metricLabel],
  );

  const handleReset = () => {
    setDepth(DEFAULT_DEPTH);
    setIsPlaying(false);
    setMetric(DEFAULT_METRIC);
    setPreset(DEFAULT_PRESET);
    setSplitStep(DEFAULT_SPLIT_STEP);
  };

  return (
    <ToolWorkbenchLayout
      controls={
        <div className="space-y-5">
          <PresetSelector
            label="Preset"
            onChange={setPreset}
            options={presetOptions}
            value={preset}
          />
          <SegmentedToggle
            label="Distance"
            onChange={setMetric}
            options={metricOptions}
            value={metric}
          />
          <SliderControl
            formatValue={(value) => `${value}`}
            label="Depth"
            max={5}
            min={1}
            onChange={setDepth}
            value={depth}
          />
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Split steps</span>
              <span>
                {splitStep} / {MAX_SPLIT_STEP}
              </span>
            </div>
            <div className="mb-3 grid grid-cols-5 gap-1">
              {Array.from({ length: MAX_SPLIT_STEP }, (_, index) => (
                <span
                  key={index}
                  className={`h-2 rounded-full ${
                    index < splitStep ? "bg-split" : "bg-inset"
                  }`}
                />
              ))}
            </div>
            <PlayControls
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying((current) => !current)}
              onStepBackward={() => {
                setIsPlaying(false);
                setSplitStep((current) => Math.max(1, current - 1));
              }}
              onStepForward={() => {
                setIsPlaying(false);
                setSplitStep((current) => Math.min(MAX_SPLIT_STEP, current + 1));
              }}
            />
          </div>
        </div>
      }
      header={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Workbench
            </p>
            <h2 className="truncate text-xl font-semibold leading-tight text-[var(--text-primary)] sm:text-2xl">
              {heading}
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-inset px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <span className="size-2 rounded-full bg-success" />
            {statusLabel}
          </div>
        </div>
      }
      outputSummary={
        <>
          <p className="text-2xl font-semibold leading-tight text-[var(--text-primary)]">
            {prediction}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {presetLabel} preview with depth {depth}, {metric} distance, and{" "}
            {splitStep} active split steps.
          </p>
        </>
      }
      resetAction={<ResetButton onReset={handleReset} />}
      visualization={
        <ResponsivePlot
          ariaLabel={`${heading} plot preview`}
          className="min-h-[24rem]"
          domain={PREVIEW_DOMAIN}
          margin={{ bottom: 52, left: 48, right: 24, top: 28 }}
        >
          {({ bounds, transform }) => (
            <>
              <PlotGrid transform={transform} />
              <PlotRegions
                className="transition-all duration-200"
                regions={previewRegions}
                transform={transform}
              />
              <PlotSegments
                className="drop-shadow-[0_0_16px_var(--split)] transition-all duration-200"
                segments={previewSegments}
                transform={transform}
              />
              <PlotAxes
                transform={transform}
                xLabel="Feature x"
                yLabel="Feature y"
              />
              <PlotPointSeries points={previewPoints} transform={transform} />
              <PlotLabels
                labels={[
                  {
                    anchor: "start",
                    id: "split-label",
                    offsetX: 8,
                    offsetY: -14,
                    text: `x < ${splitX.toFixed(1)}`,
                    x: splitX,
                    y: 9.2,
                  },
                ]}
                transform={transform}
              />
              <PlotLegend bounds={bounds} items={previewLegend} />
            </>
          )}
        </ResponsivePlot>
      }
      visualizationLabel={heading}
    />
  );
}

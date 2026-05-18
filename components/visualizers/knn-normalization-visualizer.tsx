"use client";

import { useMemo, useState } from "react";
import { ToolWorkbenchLayout } from "@/components/layout/tool-workbench-layout";
import {
  PresetSelector,
  ResetButton,
  SegmentedToggle,
  SliderControl,
} from "@/components/ui";
import {
  KNN_DISTANCE_OPTIONS,
  KnnPlot2D,
  NeighborList,
  VoteBreakdown,
  denormalizePointWithZScore,
  formatValue,
  getClassName,
  getDatasetClassOrder,
  getDefaultK,
  getDefaultMetric,
  getDefaultQuery,
  getNormalizedDomain,
  type KnnDistanceOption,
} from "@/components/visualizers/knn-shared";
import {
  calculateZScoreStats2D,
  normalizePointWithZScore,
  predictKnnClass,
} from "@/lib/algorithms";
import {
  getDatasetPresetsForToolPath,
  type ClassificationDataset2D,
} from "@/lib/datasets";

const NORMALIZATION_TOOL_PATH = "/week1/knn/normalization";

const DATASETS = getDatasetPresetsForToolPath(
  NORMALIZATION_TOOL_PATH,
) as readonly ClassificationDataset2D[];

const getInitialDataset = () => DATASETS[0];

export function KnnNormalizationVisualizer() {
  const [dataset, setDataset] = useState(getInitialDataset);
  const [k, setK] = useState(() => getDefaultK(getInitialDataset()));
  const [metric, setMetric] = useState<KnnDistanceOption>(() =>
    getDefaultMetric(getInitialDataset()),
  );
  const [query, setQuery] = useState(() => getDefaultQuery(getInitialDataset()));
  const classOrder = useMemo(() => getDatasetClassOrder(dataset), [dataset]);
  const stats = useMemo(
    () => calculateZScoreStats2D(dataset.samples),
    [dataset.samples],
  );
  const normalizedDomain = useMemo(
    () => getNormalizedDomain(dataset.domain, stats),
    [dataset.domain, stats],
  );
  const normalizedSamples = useMemo(
    () =>
      dataset.samples.map((sample) => ({
        ...sample,
        ...normalizePointWithZScore(sample, stats),
      })),
    [dataset.samples, stats],
  );
  const normalizedQuery = useMemo(
    () => normalizePointWithZScore(query, stats),
    [query, stats],
  );
  const rawPrediction = useMemo(
    () =>
      predictKnnClass({
        classOrder,
        k,
        metric,
        query,
        samples: dataset.samples,
      }),
    [classOrder, dataset.samples, k, metric, query],
  );
  const normalizedPrediction = useMemo(
    () =>
      predictKnnClass({
        classOrder,
        k,
        metric,
        normalize: true,
        query,
        samples: dataset.samples,
      }),
    [classOrder, dataset.samples, k, metric, query],
  );
  const plotNormalizedPrediction = useMemo(
    () => ({
      ...normalizedPrediction,
      neighbors: normalizedPrediction.neighbors.map((neighbor) => ({
        ...neighbor,
        sample:
          normalizedSamples.find((sample) => sample.id === neighbor.sample.id) ??
          neighbor.sample,
      })),
    }),
    [normalizedPrediction, normalizedSamples],
  );
  const presetOptions = useMemo(
    () =>
      DATASETS.map((datasetPreset) => ({
        label: datasetPreset.label,
        value: datasetPreset.id,
      })),
    [],
  );
  const rawPredictedName = getClassName(
    dataset.classes,
    rawPrediction.predictedClassLabel,
  );
  const normalizedPredictedName = getClassName(
    dataset.classes,
    normalizedPrediction.predictedClassLabel,
  );

  const resetForDataset = (nextDataset: ClassificationDataset2D) => {
    setDataset(nextDataset);
    setK(getDefaultK(nextDataset));
    setMetric(getDefaultMetric(nextDataset));
    setQuery(getDefaultQuery(nextDataset));
  };

  const handlePresetChange = (datasetId: string) => {
    const nextDataset =
      DATASETS.find((datasetPreset) => datasetPreset.id === datasetId) ??
      getInitialDataset();

    resetForDataset(nextDataset);
  };

  return (
    <ToolWorkbenchLayout
      controls={
        <div className="space-y-5">
          <PresetSelector
            label="Dataset"
            onChange={handlePresetChange}
            options={presetOptions}
            value={dataset.id}
          />
          <SegmentedToggle
            label="Distance metric"
            onChange={setMetric}
            options={KNN_DISTANCE_OPTIONS}
            value={metric}
          />
          <SliderControl
            formatValue={(value) => `${value}`}
            label="Neighbors k"
            max={dataset.samples.length}
            min={1}
            onChange={setK}
            value={k}
          />
        </div>
      }
      header={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Workbench
            </p>
            <h2 className="truncate text-xl font-semibold leading-tight text-[var(--text-primary)] sm:text-2xl">
              Same query, two feature scales
            </h2>
          </div>
          <div className="rounded-full border border-border bg-inset px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            z-score comparison
          </div>
        </div>
      }
      outputSummary={
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <PredictionTile label="Raw space" value={rawPredictedName} />
            <PredictionTile
              label="Normalized space"
              value={normalizedPredictedName}
            />
          </div>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            The linked query is ({formatValue(query.x)}, {formatValue(query.y)})
            in raw units and ({formatValue(normalizedQuery.x)},{" "}
            {formatValue(normalizedQuery.y)}) after z-score scaling.
          </p>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Normalized vote
            </p>
            <VoteBreakdown
              classes={dataset.classes}
              prediction={normalizedPrediction}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Changed neighbors
            </p>
            <NeighborComparison
              classes={dataset.classes}
              normalizedPrediction={normalizedPrediction}
              rawPrediction={rawPrediction}
            />
          </div>
        </div>
      }
      resetAction={<ResetButton onReset={() => resetForDataset(dataset)} />}
      visualization={
        <div className="grid h-full min-h-[24rem] min-w-0 gap-3 p-3 lg:grid-cols-2">
          <div className="min-h-[24rem] min-w-0 overflow-hidden rounded-md border border-border bg-canvas">
            <KnnPlot2D
              ariaLabel={`${dataset.label} raw kNN plot`}
              classes={dataset.classes}
              domain={dataset.domain}
              onQueryChange={setQuery}
              prediction={rawPrediction}
              query={query}
              samples={dataset.samples}
              subtitle="Original feature units"
              title="Raw distance"
              xLabel={`${dataset.featureX.label}${
                dataset.featureX.unit ? ` (${dataset.featureX.unit})` : ""
              }`}
              yLabel={`${dataset.featureY.label}${
                dataset.featureY.unit ? ` (${dataset.featureY.unit})` : ""
              }`}
            />
          </div>
          <div className="min-h-[24rem] min-w-0 overflow-hidden rounded-md border border-border bg-canvas">
            <KnnPlot2D
              ariaLabel={`${dataset.label} normalized kNN plot`}
              classes={dataset.classes}
              domain={normalizedDomain}
              onQueryChange={(nextQuery) =>
                setQuery(denormalizePointWithZScore(nextQuery, stats))
              }
              prediction={plotNormalizedPrediction}
              query={normalizedQuery}
              samples={normalizedSamples}
              subtitle="Zero mean, unit variance"
              title="Normalized distance"
              xLabel={`${dataset.featureX.label} z`}
              yLabel={`${dataset.featureY.label} z`}
            />
          </div>
        </div>
      }
      visualizationLabel="Raw and normalized kNN comparison"
    />
  );
}

function PredictionTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-inset p-3">
      <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function NeighborComparison({
  classes,
  normalizedPrediction,
  rawPrediction,
}: {
  classes: ClassificationDataset2D["classes"];
  normalizedPrediction: ReturnType<typeof predictKnnClass>;
  rawPrediction: ReturnType<typeof predictKnnClass>;
}) {
  const rawNeighborIds = new Set(
    rawPrediction.neighbors.map((neighbor) => neighbor.sample.id),
  );
  const changedNeighbors = normalizedPrediction.neighbors.filter(
    (neighbor) => !rawNeighborIds.has(neighbor.sample.id),
  );

  if (changedNeighbors.length === 0) {
    return (
      <p className="rounded-md border border-border bg-inset px-3 py-2 text-sm leading-6 text-[var(--text-secondary)]">
        The same neighbor set wins under both scales.
      </p>
    );
  }

  return (
    <NeighborList classes={classes} neighbors={changedNeighbors.slice(0, 4)} />
  );
}

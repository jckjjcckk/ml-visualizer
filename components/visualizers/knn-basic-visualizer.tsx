"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  createDecisionRegions,
  formatValue,
  getClassName,
  getDatasetClassOrder,
  getDefaultK,
  getDefaultMetric,
  getDefaultQuery,
  type KnnDistanceOption,
} from "@/components/visualizers/knn-shared";
import { predictKnnClass } from "@/lib/algorithms";
import {
  getDatasetPresetsForToolPath,
  type ClassificationDataset2D,
} from "@/lib/datasets";

const BASIC_TOOL_PATH = "/week1/knn/basic";

const DATASETS = getDatasetPresetsForToolPath(
  BASIC_TOOL_PATH,
) as readonly ClassificationDataset2D[];

const getInitialDataset = () => DATASETS[0];

export function KnnBasicVisualizer() {
  const [dataset, setDataset] = useState(getInitialDataset);
  const [k, setK] = useState(() => getDefaultK(getInitialDataset()));
  const [metric, setMetric] = useState<KnnDistanceOption>(() =>
    getDefaultMetric(getInitialDataset()),
  );
  const [query, setQuery] = useState(() => getDefaultQuery(getInitialDataset()));
  const [showRegions, setShowRegions] = useState(false);
  const classOrder = useMemo(() => getDatasetClassOrder(dataset), [dataset]);
  const prediction = useMemo(
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
  const decisionRegions = useMemo(
    () =>
      showRegions
        ? createDecisionRegions({
            classOrder,
            classes: dataset.classes,
            domain: dataset.domain,
            k,
            metric,
            samples: dataset.samples,
          })
        : [],
    [classOrder, dataset.classes, dataset.domain, dataset.samples, k, metric, showRegions],
  );
  const presetOptions = useMemo(
    () =>
      DATASETS.map((datasetPreset) => ({
        label: datasetPreset.label,
        value: datasetPreset.id,
      })),
    [],
  );
  const predictedName = getClassName(
    dataset.classes,
    prediction.predictedClassLabel,
  );

  const resetForDataset = (nextDataset: ClassificationDataset2D) => {
    setDataset(nextDataset);
    setK(getDefaultK(nextDataset));
    setMetric(getDefaultMetric(nextDataset));
    setQuery(getDefaultQuery(nextDataset));
    setShowRegions(false);
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
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-border bg-inset px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:border-border-strong hover:text-[var(--text-primary)]">
            <span className="flex min-w-0 items-center gap-2">
              {showRegions ? (
                <Eye aria-hidden="true" className="size-4 shrink-0" />
              ) : (
                <EyeOff aria-hidden="true" className="size-4 shrink-0" />
              )}
              <span className="truncate">Decision-region preview</span>
            </span>
            <input
              checked={showRegions}
              className="size-4 accent-prediction"
              onChange={(event) => setShowRegions(event.currentTarget.checked)}
              type="checkbox"
            />
          </label>
        </div>
      }
      header={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Workbench
            </p>
            <h2 className="truncate text-xl font-semibold leading-tight text-[var(--text-primary)] sm:text-2xl">
              Move the query, then inspect the vote
            </h2>
          </div>
          <div className="rounded-full border border-border bg-inset px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            {metric} distance
          </div>
        </div>
      }
      outputSummary={
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-semibold leading-tight text-[var(--text-primary)]">
              {predictedName}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              k = {prediction.effectiveK}; query at ({formatValue(query.x)},{" "}
              {formatValue(query.y)}).
            </p>
          </div>
          <VoteBreakdown classes={dataset.classes} prediction={prediction} />
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Nearest neighbors
            </p>
            <NeighborList
              classes={dataset.classes}
              neighbors={prediction.neighbors}
            />
          </div>
        </div>
      }
      resetAction={<ResetButton onReset={() => resetForDataset(dataset)} />}
      visualization={
        <KnnPlot2D
          ariaLabel={`${dataset.label} kNN classification plot`}
          classes={dataset.classes}
          decisionRegions={decisionRegions}
          domain={dataset.domain}
          onQueryChange={setQuery}
          prediction={prediction}
          query={query}
          samples={dataset.samples}
          subtitle={dataset.summary}
          title={dataset.label}
          xLabel={`${dataset.featureX.label}${
            dataset.featureX.unit ? ` (${dataset.featureX.unit})` : ""
          }`}
          yLabel={`${dataset.featureY.label}${
            dataset.featureY.unit ? ` (${dataset.featureY.unit})` : ""
          }`}
        />
      }
      visualizationLabel="kNN 2D classification playground"
    />
  );
}

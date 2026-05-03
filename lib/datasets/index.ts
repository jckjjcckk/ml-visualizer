import {
  CITRUS_WIDTH_HEIGHT_DATASET,
  CLASSIFICATION_DATASETS,
  KNN_OVERLAP_BOUNDARY_DATASET,
  LOGISTIC_LINEAR_BOUNDARY_DATASET,
  LOGISTIC_OVERLAP_BOUNDARY_DATASET,
  NORMALIZATION_SCALE_TRAP_DATASET,
  NORMALIZATION_UNIT_MISMATCH_DATASET,
  TREE_AXIS_SPLITS_DATASET,
  TREE_INFORMATION_GAIN_TOY_DATASET,
  TREE_MISCLASSIFICATION_TRAP_DATASET,
  TREE_PRUNING_NOISY_CORNER_DATASET,
  TREE_PRUNING_VALIDATION_DATASET,
} from "./classification";
import {
  GRADIENT_DESCENT_POORLY_SCALED_DATASET,
  GRADIENT_DESCENT_WELL_CONDITIONED_DATASET,
  POND_COOL_FRONT_DATASET,
  POND_TEMPERATURE_DATASET,
  REGRESSION_DATASETS,
  RESIDUAL_BALANCED_DATASET,
  RESIDUAL_OUTLIER_DATASET,
} from "./regression";
import type {
  ClassificationDataset2D,
  DatasetDomain2D,
  DatasetPreset,
  NumericRange,
  RegressionDataset1D,
} from "./types";

export * from "./classification";
export * from "./regression";
export * from "./types";

export const ALL_DATASET_PRESETS = [
  ...CLASSIFICATION_DATASETS,
  ...REGRESSION_DATASETS,
] as const satisfies readonly DatasetPreset[];

// The digit route is intentionally absent until raw digit files are packed for runtime use.
export const DATASET_PRESETS_BY_TOOL_PATH = {
  "/week1/knn/basic": [
    CITRUS_WIDTH_HEIGHT_DATASET,
    KNN_OVERLAP_BOUNDARY_DATASET,
  ],
  "/week1/knn/normalization": [
    NORMALIZATION_SCALE_TRAP_DATASET,
    NORMALIZATION_UNIT_MISMATCH_DATASET,
  ],
  "/week2/decision-tree/basic": [
    CITRUS_WIDTH_HEIGHT_DATASET,
    TREE_AXIS_SPLITS_DATASET,
  ],
  "/week2/decision-tree/information-gain": [
    TREE_INFORMATION_GAIN_TOY_DATASET,
    TREE_MISCLASSIFICATION_TRAP_DATASET,
  ],
  "/week2/decision-tree/pruning": [
    TREE_PRUNING_VALIDATION_DATASET,
    TREE_PRUNING_NOISY_CORNER_DATASET,
  ],
  "/week3/linear-regression/basic": [
    POND_TEMPERATURE_DATASET,
    POND_COOL_FRONT_DATASET,
  ],
  "/week3/linear-regression/residuals": [
    RESIDUAL_OUTLIER_DATASET,
    RESIDUAL_BALANCED_DATASET,
  ],
  "/week3/linear-regression/gradient-descent": [
    GRADIENT_DESCENT_WELL_CONDITIONED_DATASET,
    GRADIENT_DESCENT_POORLY_SCALED_DATASET,
  ],
  "/week4/logistic-regression/basic": [
    LOGISTIC_LINEAR_BOUNDARY_DATASET,
    LOGISTIC_OVERLAP_BOUNDARY_DATASET,
  ],
} as const satisfies Record<string, readonly DatasetPreset[]>;

const EMPTY_DATASET_PRESETS: readonly DatasetPreset[] = [];

const DATASET_PRESET_LOOKUP: ReadonlyMap<string, readonly DatasetPreset[]> =
  new Map(Object.entries(DATASET_PRESETS_BY_TOOL_PATH));

export function getDatasetPresetsForToolPath(
  path: string,
): readonly DatasetPreset[] {
  return DATASET_PRESET_LOOKUP.get(path) ?? EMPTY_DATASET_PRESETS;
}

const formatDatasetError = (datasetId: string, message: string) =>
  `Dataset preset "${datasetId}" is invalid: ${message}`;

const isFiniteNumber = (value: number) => Number.isFinite(value);

const validateRange = (
  datasetId: string,
  range: NumericRange,
  rangeLabel: string,
) => {
  if (!isFiniteNumber(range[0]) || !isFiniteNumber(range[1])) {
    throw new Error(
      formatDatasetError(datasetId, `${rangeLabel} range must be finite.`),
    );
  }

  if (range[0] >= range[1]) {
    throw new Error(
      formatDatasetError(
        datasetId,
        `${rangeLabel} range must be ascending.`,
      ),
    );
  }
};

const validateDomain = (datasetId: string, domain: DatasetDomain2D) => {
  validateRange(datasetId, domain.x, "x");
  validateRange(datasetId, domain.y, "y");
};

const isInRange = (value: number, range: NumericRange) =>
  value >= range[0] && value <= range[1];

const validatePoint = ({
  datasetId,
  domain,
  id,
  x,
  y,
}: {
  datasetId: string;
  domain: DatasetDomain2D;
  id: string;
  x: number;
  y: number;
}) => {
  if (!isFiniteNumber(x) || !isFiniteNumber(y)) {
    throw new Error(
      formatDatasetError(datasetId, `sample "${id}" must be finite.`),
    );
  }

  if (!isInRange(x, domain.x) || !isInRange(y, domain.y)) {
    throw new Error(
      formatDatasetError(
        datasetId,
        `sample "${id}" must fit within the declared domain.`,
      ),
    );
  }
};

const validateUniqueIds = (
  datasetId: string,
  sampleIds: readonly string[],
) => {
  const ids = new Set<string>();

  for (const id of sampleIds) {
    if (ids.has(id)) {
      throw new Error(
        formatDatasetError(datasetId, `sample id "${id}" is duplicated.`),
      );
    }

    ids.add(id);
  }
};

const validateClassificationDataset = (
  dataset: ClassificationDataset2D,
) => {
  validateDomain(dataset.id, dataset.domain);

  if (dataset.classes.length === 0) {
    throw new Error(formatDatasetError(dataset.id, "classes cannot be empty."));
  }

  if (dataset.samples.length === 0) {
    throw new Error(formatDatasetError(dataset.id, "samples cannot be empty."));
  }

  const classLabels = new Set(
    dataset.classes.map((datasetClass) => datasetClass.label),
  );

  validateUniqueIds(
    dataset.id,
    dataset.samples.map((sample) => sample.id),
  );

  for (const sample of dataset.samples) {
    if (!classLabels.has(sample.classLabel)) {
      throw new Error(
        formatDatasetError(
          dataset.id,
          `sample "${sample.id}" references unknown class "${sample.classLabel}".`,
        ),
      );
    }

    validatePoint({
      datasetId: dataset.id,
      domain: dataset.domain,
      id: sample.id,
      x: sample.x,
      y: sample.y,
    });
  }

  if (dataset.defaultQuery) {
    validatePoint({
      datasetId: dataset.id,
      domain: dataset.domain,
      id: "defaultQuery",
      x: dataset.defaultQuery.x,
      y: dataset.defaultQuery.y,
    });
  }

  for (const split of dataset.suggestedSplits ?? []) {
    const range = split.axis === "x" ? dataset.domain.x : dataset.domain.y;

    if (!isFiniteNumber(split.threshold) || !isInRange(split.threshold, range)) {
      throw new Error(
        formatDatasetError(
          dataset.id,
          `suggested split "${split.id}" must be finite and inside the domain.`,
        ),
      );
    }
  }
};

const validateRegressionDataset = (dataset: RegressionDataset1D) => {
  validateDomain(dataset.id, dataset.domain);

  if (dataset.samples.length === 0) {
    throw new Error(formatDatasetError(dataset.id, "samples cannot be empty."));
  }

  validateUniqueIds(
    dataset.id,
    dataset.samples.map((sample) => sample.id),
  );

  for (const sample of dataset.samples) {
    validatePoint({
      datasetId: dataset.id,
      domain: dataset.domain,
      id: sample.id,
      x: sample.x,
      y: sample.target,
    });
  }
};

const validateDatasetPreset = (dataset: DatasetPreset) => {
  if (dataset.kind === "classification-2d") {
    validateClassificationDataset(dataset);
    return;
  }

  validateRegressionDataset(dataset);
};

for (const dataset of ALL_DATASET_PRESETS) {
  validateDatasetPreset(dataset);
}

for (const [toolPath, presets] of Object.entries(DATASET_PRESETS_BY_TOOL_PATH)) {
  if (presets.length < 2) {
    throw new Error(`${toolPath} must have at least two dataset presets.`);
  }
}

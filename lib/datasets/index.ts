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
import { MNIST_DIGIT_DATASET } from "./digits";
import type {
  ClassificationDataset2D,
  DatasetDomain2D,
  DatasetPreset,
  DigitDataset,
  NumericRange,
  RegressionDataset1D,
} from "./types";

export * from "./classification";
export * from "./digits";
export * from "./regression";
export * from "./types";

export const ALL_DATASET_PRESETS = [
  ...CLASSIFICATION_DATASETS,
  ...REGRESSION_DATASETS,
  MNIST_DIGIT_DATASET,
] as const satisfies readonly DatasetPreset[];

export const DATASET_PRESETS_BY_TOOL_PATH = {
  "/week1/knn/basic": [
    CITRUS_WIDTH_HEIGHT_DATASET,
    KNN_OVERLAP_BOUNDARY_DATASET,
  ],
  "/week1/knn/normalization": [
    NORMALIZATION_SCALE_TRAP_DATASET,
    NORMALIZATION_UNIT_MISMATCH_DATASET,
  ],
  "/week1/knn/mnist": [MNIST_DIGIT_DATASET],
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

const base64ByteLength = (value: string) => {
  const trimmed = value.trim();

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed)) {
    return null;
  }

  const unpaddedLength = trimmed.replace(/=+$/, "").length;
  return Math.floor((unpaddedLength * 3) / 4);
};

const validateDigitDataset = (dataset: DigitDataset) => {
  if (
    !Number.isInteger(dataset.image.width) ||
    !Number.isInteger(dataset.image.height) ||
    !Number.isInteger(dataset.image.pixelCount)
  ) {
    throw new Error(
      formatDatasetError(dataset.id, "image dimensions must be integers."),
    );
  }

  if (
    dataset.image.width <= 0 ||
    dataset.image.height <= 0 ||
    dataset.image.pixelCount !== dataset.image.width * dataset.image.height
  ) {
    throw new Error(
      formatDatasetError(dataset.id, "image dimensions are inconsistent."),
    );
  }

  if (dataset.classes.length !== 10) {
    throw new Error(
      formatDatasetError(dataset.id, "digit datasets must expose 10 classes."),
    );
  }

  const classLabels = new Set(
    dataset.classes.map((datasetClass) => datasetClass.label),
  );
  const expectedLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

  for (const expectedLabel of expectedLabels) {
    if (!classLabels.has(expectedLabel)) {
      throw new Error(
        formatDatasetError(
          dataset.id,
          `digit class ${expectedLabel} is missing.`,
        ),
      );
    }
  }

  if (dataset.samples.length === 0) {
    throw new Error(formatDatasetError(dataset.id, "samples cannot be empty."));
  }

  validateUniqueIds(
    dataset.id,
    dataset.samples.map((sample) => sample.id),
  );

  const sampleIds = new Set<string>();

  for (const sample of dataset.samples) {
    sampleIds.add(sample.id);

    if (!classLabels.has(sample.label)) {
      throw new Error(
        formatDatasetError(
          dataset.id,
          `sample "${sample.id}" references unknown digit ${sample.label}.`,
        ),
      );
    }

    const byteLength = base64ByteLength(sample.pixelsBase64);

    if (byteLength !== dataset.image.pixelCount) {
      throw new Error(
        formatDatasetError(
          dataset.id,
          `sample "${sample.id}" must contain exactly ${dataset.image.pixelCount} pixels.`,
        ),
      );
    }
  }

  if (!sampleIds.has(dataset.defaultQueryId)) {
    throw new Error(
      formatDatasetError(dataset.id, "default query id must reference a sample."),
    );
  }
};

const validateDatasetPreset = (dataset: DatasetPreset) => {
  if (dataset.kind === "classification-2d") {
    validateClassificationDataset(dataset);
    return;
  }

  if (dataset.kind === "regression-1d") {
    validateRegressionDataset(dataset);
    return;
  }

  validateDigitDataset(dataset);
};

for (const dataset of ALL_DATASET_PRESETS) {
  validateDatasetPreset(dataset);
}

for (const [toolPath, presets] of Object.entries(DATASET_PRESETS_BY_TOOL_PATH)) {
  if (toolPath === "/week1/knn/mnist") {
    if (presets.length < 1) {
      throw new Error(`${toolPath} must have a digit dataset preset.`);
    }

    continue;
  }

  if (presets.length < 2) {
    throw new Error(`${toolPath} must have at least two dataset presets.`);
  }
}

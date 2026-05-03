import type { ClassificationDataset2D, DatasetClass } from "./types";

const citrusClasses = [
  {
    colorToken: "var(--class-a)",
    label: "orange",
    name: "Orange",
  },
  {
    colorToken: "var(--class-b)",
    label: "lemon",
    name: "Lemon",
  },
] as const satisfies readonly DatasetClass[];

const binaryClasses = [
  {
    colorToken: "var(--class-a)",
    label: "negative",
    name: "Class 0",
  },
  {
    colorToken: "var(--class-b)",
    label: "positive",
    name: "Class 1",
  },
] as const satisfies readonly DatasetClass[];

export const CITRUS_WIDTH_HEIGHT_DATASET = {
  classes: citrusClasses,
  defaultQuery: {
    x: 7,
    y: 9,
  },
  defaultSettings: {
    k: 3,
    metric: "euclidean",
  },
  domain: {
    x: [5.5, 8],
    y: [6.5, 10],
  },
  featureX: {
    id: "width",
    label: "Width",
    unit: "cm",
  },
  featureY: {
    id: "height",
    label: "Height",
    unit: "cm",
  },
  id: "citrus-width-height",
  kind: "classification-2d",
  label: "Citrus width and height",
  samples: [
    { classLabel: "orange", id: "orange-1", split: "train", x: 6.8, y: 7.4 },
    { classLabel: "orange", id: "orange-2", split: "train", x: 7.1, y: 7.5 },
    { classLabel: "orange", id: "orange-3", split: "train", x: 7.6, y: 8.2 },
    { classLabel: "orange", id: "orange-4", split: "train", x: 7.2, y: 7.2 },
    { classLabel: "lemon", id: "lemon-1", split: "train", x: 7.2, y: 9.3 },
    { classLabel: "lemon", id: "lemon-2", split: "train", x: 7.3, y: 9.5 },
    { classLabel: "lemon", id: "lemon-3", split: "train", x: 7.2, y: 9 },
    { classLabel: "lemon", id: "lemon-4", split: "train", x: 6.9, y: 7 },
  ],
  source: "Week 1 lecture citrus classification example.",
  suggestedSplits: [
    {
      axis: "y",
      id: "height-8-6",
      label: "height >= 8.6",
      threshold: 8.6,
    },
    {
      axis: "x",
      id: "width-7-15",
      label: "width >= 7.15",
      threshold: 7.15,
    },
  ],
  summary:
    "The Week 1 fruit table represented as two measured features for nearest-neighbor and tree classifiers.",
} as const satisfies ClassificationDataset2D;

export const KNN_OVERLAP_BOUNDARY_DATASET = {
  classes: [
    {
      colorToken: "var(--class-a)",
      label: "blue",
      name: "Blue class",
    },
    {
      colorToken: "var(--class-b)",
      label: "amber",
      name: "Amber class",
    },
  ],
  defaultQuery: {
    x: 5,
    y: 5,
  },
  defaultSettings: {
    k: 5,
    metric: "euclidean",
  },
  domain: {
    x: [0, 10],
    y: [0, 10],
  },
  featureX: {
    id: "feature-x",
    label: "Feature x",
  },
  featureY: {
    id: "feature-y",
    label: "Feature y",
  },
  id: "knn-overlap-boundary",
  kind: "classification-2d",
  label: "Overlapping boundary",
  samples: [
    { classLabel: "blue", id: "blue-1", split: "train", x: 1.4, y: 2.1 },
    { classLabel: "blue", id: "blue-2", split: "train", x: 2.2, y: 3.7 },
    { classLabel: "blue", id: "blue-3", split: "train", x: 3.1, y: 2.6 },
    { classLabel: "blue", id: "blue-4", split: "train", x: 3.7, y: 4.8 },
    { classLabel: "blue", id: "blue-5", split: "train", x: 4.7, y: 4.2 },
    { classLabel: "blue", id: "blue-6", split: "train", x: 5.2, y: 6.2 },
    { classLabel: "amber", id: "amber-1", split: "train", x: 4.6, y: 5.2 },
    { classLabel: "amber", id: "amber-2", split: "train", x: 5.6, y: 4.4 },
    { classLabel: "amber", id: "amber-3", split: "train", x: 6.1, y: 5.8 },
    { classLabel: "amber", id: "amber-4", split: "train", x: 6.9, y: 7.1 },
    { classLabel: "amber", id: "amber-5", split: "train", x: 7.8, y: 5.8 },
    { classLabel: "amber", id: "amber-6", split: "train", x: 8.4, y: 7.5 },
  ],
  source: "Synthetic deterministic 2D classification preset for kNN boundary behavior.",
  summary:
    "Two partly overlapping clusters that make k changes visible around the center of the feature plane.",
} as const satisfies ClassificationDataset2D;

export const NORMALIZATION_SCALE_TRAP_DATASET = {
  classes: binaryClasses,
  defaultQuery: {
    x: 780,
    y: 2.7,
  },
  defaultSettings: {
    k: 3,
    metric: "euclidean",
    normalize: true,
  },
  domain: {
    x: [0, 1000],
    y: [0, 10],
  },
  featureX: {
    id: "annual-spend",
    label: "Annual spend",
    unit: "USD",
  },
  featureY: {
    id: "review-score",
    label: "Review score",
  },
  id: "normalization-scale-trap",
  kind: "classification-2d",
  label: "Scale-dominated distance",
  samples: [
    { classLabel: "negative", id: "negative-1", split: "train", x: 120, y: 2.1 },
    { classLabel: "negative", id: "negative-2", split: "train", x: 260, y: 2.6 },
    { classLabel: "negative", id: "negative-3", split: "train", x: 480, y: 2.4 },
    { classLabel: "negative", id: "negative-4", split: "train", x: 910, y: 2.2 },
    { classLabel: "positive", id: "positive-1", split: "train", x: 180, y: 7.6 },
    { classLabel: "positive", id: "positive-2", split: "train", x: 420, y: 7.9 },
    { classLabel: "positive", id: "positive-3", split: "train", x: 730, y: 7.4 },
    { classLabel: "positive", id: "positive-4", split: "train", x: 960, y: 7.7 },
  ],
  source: "Synthetic deterministic kNN normalization pitfall preset.",
  summary:
    "A large-scale x feature can dominate Euclidean distance even when y carries the class signal.",
} as const satisfies ClassificationDataset2D;

export const NORMALIZATION_UNIT_MISMATCH_DATASET = {
  classes: [
    {
      colorToken: "var(--class-a)",
      label: "indoor",
      name: "Indoor",
    },
    {
      colorToken: "var(--class-b)",
      label: "outdoor",
      name: "Outdoor",
    },
  ],
  defaultQuery: {
    x: 12.2,
    y: 1180,
  },
  defaultSettings: {
    k: 3,
    metric: "euclidean",
    normalize: true,
  },
  domain: {
    x: [0, 24],
    y: [0, 2000],
  },
  featureX: {
    id: "temperature",
    label: "Temperature",
    unit: "C",
  },
  featureY: {
    id: "light-level",
    label: "Light level",
    unit: "lux",
  },
  id: "normalization-unit-mismatch",
  kind: "classification-2d",
  label: "Unit mismatch",
  samples: [
    { classLabel: "indoor", id: "indoor-1", split: "train", x: 9.5, y: 220 },
    { classLabel: "indoor", id: "indoor-2", split: "train", x: 11.1, y: 460 },
    { classLabel: "indoor", id: "indoor-3", split: "train", x: 13.2, y: 760 },
    { classLabel: "indoor", id: "indoor-4", split: "train", x: 14.1, y: 1020 },
    { classLabel: "outdoor", id: "outdoor-1", split: "train", x: 10.4, y: 1280 },
    { classLabel: "outdoor", id: "outdoor-2", split: "train", x: 12.8, y: 1420 },
    { classLabel: "outdoor", id: "outdoor-3", split: "train", x: 15.6, y: 1680 },
    { classLabel: "outdoor", id: "outdoor-4", split: "train", x: 18.4, y: 1880 },
  ],
  source: "Synthetic deterministic kNN normalization pitfall preset.",
  summary:
    "A lux feature overwhelms a Celsius feature unless both dimensions are normalized first.",
} as const satisfies ClassificationDataset2D;

export const TREE_AXIS_SPLITS_DATASET = {
  classes: binaryClasses,
  defaultSettings: {
    maxDepth: 2,
  },
  domain: {
    x: [0, 10],
    y: [0, 10],
  },
  featureX: {
    id: "feature-x",
    label: "Feature x",
  },
  featureY: {
    id: "feature-y",
    label: "Feature y",
  },
  id: "tree-axis-splits",
  kind: "classification-2d",
  label: "Axis-aligned regions",
  samples: [
    { classLabel: "negative", id: "negative-1", split: "train", x: 1.4, y: 2 },
    { classLabel: "negative", id: "negative-2", split: "train", x: 2.2, y: 7.2 },
    { classLabel: "negative", id: "negative-3", split: "train", x: 3.1, y: 3.4 },
    { classLabel: "negative", id: "negative-4", split: "train", x: 4.2, y: 6.6 },
    { classLabel: "positive", id: "positive-1", split: "train", x: 6.2, y: 2.1 },
    { classLabel: "positive", id: "positive-2", split: "train", x: 7.4, y: 3.3 },
    { classLabel: "positive", id: "positive-3", split: "train", x: 7.1, y: 7.2 },
    { classLabel: "positive", id: "positive-4", split: "train", x: 8.6, y: 6.3 },
  ],
  source: "Synthetic deterministic decision tree split-builder preset.",
  suggestedSplits: [
    {
      axis: "x",
      id: "x-5-2",
      label: "x >= 5.2",
      threshold: 5.2,
    },
    {
      axis: "y",
      id: "y-5-1",
      label: "y >= 5.1",
      threshold: 5.1,
    },
  ],
  summary:
    "A simple dataset where the first useful tree split is visibly axis-aligned.",
} as const satisfies ClassificationDataset2D;

export const TREE_INFORMATION_GAIN_TOY_DATASET = {
  classes: binaryClasses,
  defaultSettings: {
    selectedSplitId: "x-3",
  },
  domain: {
    x: [0, 6],
    y: [0, 6],
  },
  featureX: {
    id: "x1",
    label: "x1",
  },
  featureY: {
    id: "x2",
    label: "x2",
  },
  id: "tree-information-gain-toy",
  kind: "classification-2d",
  label: "Information gain toy set",
  samples: [
    { classLabel: "negative", id: "negative-1", split: "train", x: 0.9, y: 1.1 },
    { classLabel: "negative", id: "negative-2", split: "train", x: 1.4, y: 2.4 },
    { classLabel: "negative", id: "negative-3", split: "train", x: 2.1, y: 4.8 },
    { classLabel: "negative", id: "negative-4", split: "train", x: 2.7, y: 1.6 },
    { classLabel: "positive", id: "positive-1", split: "train", x: 3.4, y: 4.2 },
    { classLabel: "positive", id: "positive-2", split: "train", x: 4.1, y: 5.1 },
    { classLabel: "positive", id: "positive-3", split: "train", x: 5, y: 1.4 },
    { classLabel: "positive", id: "positive-4", split: "train", x: 5.4, y: 4.7 },
  ],
  source: "Synthetic deterministic Week 2 information gain exercise preset.",
  suggestedSplits: [
    {
      axis: "x",
      id: "x-3",
      label: "x1 >= 3",
      threshold: 3,
    },
    {
      axis: "y",
      id: "y-4",
      label: "x2 >= 4",
      threshold: 4,
    },
  ],
  summary:
    "Two candidate splits with different class purity for entropy and information-gain comparisons.",
} as const satisfies ClassificationDataset2D;

export const TREE_MISCLASSIFICATION_TRAP_DATASET = {
  classes: binaryClasses,
  defaultSettings: {
    selectedSplitId: "x-4",
  },
  domain: {
    x: [0, 8],
    y: [0, 8],
  },
  featureX: {
    id: "x1",
    label: "x1",
  },
  featureY: {
    id: "x2",
    label: "x2",
  },
  id: "tree-misclassification-trap",
  kind: "classification-2d",
  label: "Purity versus accuracy",
  samples: [
    { classLabel: "negative", id: "negative-1", split: "train", x: 1, y: 1 },
    { classLabel: "negative", id: "negative-2", split: "train", x: 1.5, y: 3.2 },
    { classLabel: "negative", id: "negative-3", split: "train", x: 2, y: 5.8 },
    { classLabel: "negative", id: "negative-4", split: "train", x: 2.8, y: 6.6 },
    { classLabel: "negative", id: "negative-5", split: "train", x: 4.4, y: 1.4 },
    { classLabel: "positive", id: "positive-1", split: "train", x: 5.1, y: 2.1 },
    { classLabel: "positive", id: "positive-2", split: "train", x: 6.4, y: 3.5 },
    { classLabel: "positive", id: "positive-3", split: "train", x: 6.9, y: 6.2 },
  ],
  source: "Synthetic deterministic Week 2 entropy motivation preset.",
  suggestedSplits: [
    {
      axis: "x",
      id: "x-4",
      label: "x1 >= 4",
      threshold: 4,
    },
    {
      axis: "y",
      id: "y-4-5",
      label: "x2 >= 4.5",
      threshold: 4.5,
    },
  ],
  summary:
    "A split can increase class certainty even when raw misclassification rate is a blunt guide.",
} as const satisfies ClassificationDataset2D;

export const TREE_PRUNING_VALIDATION_DATASET = {
  classes: [
    {
      colorToken: "var(--class-a)",
      label: "clear",
      name: "No heart disease",
    },
    {
      colorToken: "var(--class-b)",
      label: "risk",
      name: "Heart disease risk",
    },
  ],
  defaultSettings: {
    comparisonDepth: 4,
    prunedDepth: 2,
  },
  domain: {
    x: [20, 80],
    y: [15, 45],
  },
  featureX: {
    id: "age",
    label: "Age",
    unit: "years",
  },
  featureY: {
    id: "bmi",
    label: "BMI",
  },
  id: "tree-pruning-validation",
  kind: "classification-2d",
  label: "Train/validation pruning",
  samples: [
    { classLabel: "clear", id: "train-clear-1", split: "train", x: 27, y: 21 },
    { classLabel: "clear", id: "train-clear-2", split: "train", x: 33, y: 24 },
    { classLabel: "clear", id: "train-clear-3", split: "train", x: 39, y: 23 },
    { classLabel: "clear", id: "train-clear-4", split: "train", x: 45, y: 26 },
    { classLabel: "risk", id: "train-risk-1", split: "train", x: 51, y: 31 },
    { classLabel: "risk", id: "train-risk-2", split: "train", x: 57, y: 34 },
    { classLabel: "risk", id: "train-risk-3", split: "train", x: 63, y: 36 },
    { classLabel: "risk", id: "train-risk-4", split: "train", x: 70, y: 38 },
    { classLabel: "risk", id: "train-noisy-1", split: "train", x: 31, y: 20 },
    { classLabel: "clear", id: "validation-clear-1", split: "validation", x: 36, y: 22 },
    { classLabel: "clear", id: "validation-clear-2", split: "validation", x: 43, y: 25 },
    { classLabel: "risk", id: "validation-risk-1", split: "validation", x: 60, y: 35 },
    { classLabel: "risk", id: "validation-risk-2", split: "validation", x: 68, y: 39 },
  ],
  source: "Week 2 HANES-inspired classification tree preset with local synthetic values.",
  suggestedSplits: [
    {
      axis: "x",
      id: "age-50",
      label: "age >= 50",
      threshold: 50,
    },
    {
      axis: "y",
      id: "bmi-30",
      label: "BMI >= 30",
      threshold: 30,
    },
  ],
  summary:
    "A train/validation split where a noisy training point tempts an over-deep tree.",
} as const satisfies ClassificationDataset2D;

export const TREE_PRUNING_NOISY_CORNER_DATASET = {
  classes: citrusClasses,
  defaultSettings: {
    comparisonDepth: 5,
    prunedDepth: 2,
  },
  domain: {
    x: [5.5, 8.5],
    y: [6.5, 10],
  },
  featureX: {
    id: "width",
    label: "Width",
    unit: "cm",
  },
  featureY: {
    id: "height",
    label: "Height",
    unit: "cm",
  },
  id: "tree-pruning-noisy-corner",
  kind: "classification-2d",
  label: "Noisy corner",
  samples: [
    { classLabel: "orange", id: "train-orange-1", split: "train", x: 6.3, y: 7.3 },
    { classLabel: "orange", id: "train-orange-2", split: "train", x: 6.8, y: 7.5 },
    { classLabel: "orange", id: "train-orange-3", split: "train", x: 7.4, y: 8 },
    { classLabel: "orange", id: "train-orange-4", split: "train", x: 7.9, y: 7.8 },
    { classLabel: "lemon", id: "train-lemon-1", split: "train", x: 6.5, y: 9.2 },
    { classLabel: "lemon", id: "train-lemon-2", split: "train", x: 7.1, y: 9.4 },
    { classLabel: "lemon", id: "train-lemon-3", split: "train", x: 7.8, y: 9.1 },
    { classLabel: "orange", id: "train-noisy-1", split: "train", x: 8.1, y: 9.5 },
    { classLabel: "orange", id: "validation-orange-1", split: "validation", x: 6.7, y: 7.1 },
    { classLabel: "orange", id: "validation-orange-2", split: "validation", x: 7.6, y: 7.7 },
    { classLabel: "lemon", id: "validation-lemon-1", split: "validation", x: 6.9, y: 9.3 },
    { classLabel: "lemon", id: "validation-lemon-2", split: "validation", x: 8, y: 9.4 },
  ],
  source: "Synthetic deterministic citrus pruning preset.",
  suggestedSplits: [
    {
      axis: "y",
      id: "height-8-65",
      label: "height >= 8.65",
      threshold: 8.65,
    },
    {
      axis: "x",
      id: "width-8",
      label: "width >= 8",
      threshold: 8,
    },
  ],
  summary:
    "A compact fruit dataset with one tempting noisy corner that a deeper tree can memorize.",
} as const satisfies ClassificationDataset2D;

export const LOGISTIC_LINEAR_BOUNDARY_DATASET = {
  classes: binaryClasses,
  defaultSettings: {
    threshold: 0.5,
  },
  domain: {
    x: [-4, 4],
    y: [-4, 4],
  },
  featureX: {
    id: "x1",
    label: "x1",
  },
  featureY: {
    id: "x2",
    label: "x2",
  },
  id: "logistic-linear-boundary",
  kind: "classification-2d",
  label: "Linear boundary",
  samples: [
    { classLabel: "negative", id: "negative-1", split: "train", x: -3.2, y: -1.6 },
    { classLabel: "negative", id: "negative-2", split: "train", x: -2.4, y: -2.7 },
    { classLabel: "negative", id: "negative-3", split: "train", x: -1.5, y: -1.8 },
    { classLabel: "negative", id: "negative-4", split: "train", x: -0.8, y: -3.1 },
    { classLabel: "negative", id: "negative-5", split: "train", x: 0.6, y: -2.2 },
    { classLabel: "positive", id: "positive-1", split: "train", x: -0.4, y: 1.8 },
    { classLabel: "positive", id: "positive-2", split: "train", x: 0.8, y: 2.5 },
    { classLabel: "positive", id: "positive-3", split: "train", x: 1.7, y: 1.4 },
    { classLabel: "positive", id: "positive-4", split: "train", x: 2.6, y: 2.8 },
    { classLabel: "positive", id: "positive-5", split: "train", x: 3.3, y: 1.9 },
  ],
  source: "Synthetic deterministic logistic regression preset.",
  suggestedSplits: [
    {
      axis: "y",
      id: "x2-0",
      label: "x2 >= 0",
      threshold: 0,
    },
  ],
  summary:
    "A clean two-class dataset for probability contours and a thresholded linear decision boundary.",
} as const satisfies ClassificationDataset2D;

export const LOGISTIC_OVERLAP_BOUNDARY_DATASET = {
  classes: binaryClasses,
  defaultSettings: {
    threshold: 0.5,
  },
  domain: {
    x: [-4, 4],
    y: [-4, 4],
  },
  featureX: {
    id: "x1",
    label: "x1",
  },
  featureY: {
    id: "x2",
    label: "x2",
  },
  id: "logistic-overlap-boundary",
  kind: "classification-2d",
  label: "Soft overlap",
  samples: [
    { classLabel: "negative", id: "negative-1", split: "train", x: -3.1, y: -1.1 },
    { classLabel: "negative", id: "negative-2", split: "train", x: -2.3, y: 0.4 },
    { classLabel: "negative", id: "negative-3", split: "train", x: -1.2, y: -0.8 },
    { classLabel: "negative", id: "negative-4", split: "train", x: -0.3, y: -1.6 },
    { classLabel: "negative", id: "negative-5", split: "train", x: 0.7, y: -0.6 },
    { classLabel: "positive", id: "positive-1", split: "train", x: -0.7, y: 0.9 },
    { classLabel: "positive", id: "positive-2", split: "train", x: 0.4, y: 1.7 },
    { classLabel: "positive", id: "positive-3", split: "train", x: 1.3, y: 0.5 },
    { classLabel: "positive", id: "positive-4", split: "train", x: 2.2, y: 2.1 },
    { classLabel: "positive", id: "positive-5", split: "train", x: 3.1, y: 1.2 },
  ],
  source: "Synthetic deterministic logistic regression preset.",
  suggestedSplits: [
    {
      axis: "y",
      id: "x2-0-2",
      label: "x2 >= 0.2",
      threshold: 0.2,
    },
  ],
  summary:
    "A logistic-regression-ready dataset where probabilities matter because the classes overlap.",
} as const satisfies ClassificationDataset2D;

export const CLASSIFICATION_DATASETS = [
  CITRUS_WIDTH_HEIGHT_DATASET,
  KNN_OVERLAP_BOUNDARY_DATASET,
  NORMALIZATION_SCALE_TRAP_DATASET,
  NORMALIZATION_UNIT_MISMATCH_DATASET,
  TREE_AXIS_SPLITS_DATASET,
  TREE_INFORMATION_GAIN_TOY_DATASET,
  TREE_MISCLASSIFICATION_TRAP_DATASET,
  TREE_PRUNING_VALIDATION_DATASET,
  TREE_PRUNING_NOISY_CORNER_DATASET,
  LOGISTIC_LINEAR_BOUNDARY_DATASET,
  LOGISTIC_OVERLAP_BOUNDARY_DATASET,
] as const satisfies readonly ClassificationDataset2D[];

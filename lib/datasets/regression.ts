import type { RegressionDataset1D } from "./types";

export const POND_TEMPERATURE_DATASET = {
  defaultSettings: {
    initialIntercept: 0,
    initialSlope: 1,
  },
  domain: {
    x: [0, 22],
    y: [0, 25],
  },
  feature: {
    id: "forest-soil-temp",
    label: "Forest soil temperature",
    unit: "C",
  },
  id: "pond-temperature",
  kind: "regression-1d",
  label: "Pond temperature",
  samples: [
    { id: "pond-1", split: "train", target: 3.3, x: 1.8 },
    { id: "pond-2", split: "train", target: 4.7, x: 3.2 },
    { id: "pond-3", split: "train", target: 6.2, x: 5.1 },
    { id: "pond-4", split: "train", target: 8.1, x: 6.8 },
    { id: "pond-5", split: "train", target: 9.4, x: 8.4 },
    { id: "pond-6", split: "train", target: 11.8, x: 10.2 },
    { id: "pond-7", split: "train", target: 13.1, x: 12.1 },
    { id: "pond-8", split: "train", target: 15.2, x: 14 },
    { id: "pond-9", split: "train", target: 16.8, x: 15.6 },
    { id: "pond-10", split: "train", target: 18.9, x: 17.4 },
    { id: "pond-11", split: "train", target: 20.4, x: 19.2 },
    { id: "pond-12", split: "train", target: 21.7, x: 20.6 },
  ],
  source: "Week 3 pond air temperature example with local synthetic values.",
  summary:
    "A one-feature regression dataset shaped after the Week 3 pond-temperature setup.",
  target: {
    id: "pond-air-temp",
    label: "Pond air temperature",
    unit: "C",
  },
} as const satisfies RegressionDataset1D;

export const POND_COOL_FRONT_DATASET = {
  defaultSettings: {
    initialIntercept: 3,
    initialSlope: 0.8,
  },
  domain: {
    x: [0, 22],
    y: [0, 25],
  },
  feature: {
    id: "forest-soil-temp",
    label: "Forest soil temperature",
    unit: "C",
  },
  id: "pond-cool-front",
  kind: "regression-1d",
  label: "Cool-front variation",
  samples: [
    { id: "cool-1", split: "train", target: 4.2, x: 2 },
    { id: "cool-2", split: "train", target: 5.1, x: 3.7 },
    { id: "cool-3", split: "train", target: 7.4, x: 5.8 },
    { id: "cool-4", split: "train", target: 8.8, x: 7.5 },
    { id: "cool-5", split: "train", target: 10.9, x: 9.4 },
    { id: "cool-6", split: "train", target: 12.4, x: 11.1 },
    { id: "cool-7", split: "train", target: 12.8, x: 13 },
    { id: "cool-8", split: "train", target: 14.2, x: 14.8 },
    { id: "cool-9", split: "train", target: 14.9, x: 16.2 },
    { id: "cool-10", split: "train", target: 16.7, x: 18.1 },
    { id: "cool-11", split: "train", target: 17.8, x: 20.2 },
  ],
  source: "Week 3 pond air temperature example with local synthetic values.",
  summary:
    "A second pond-style preset with a slightly cooler high-temperature tail.",
  target: {
    id: "pond-air-temp",
    label: "Pond air temperature",
    unit: "C",
  },
} as const satisfies RegressionDataset1D;

export const RESIDUAL_OUTLIER_DATASET = {
  defaultSettings: {
    initialIntercept: 1,
    initialSlope: 1.2,
  },
  domain: {
    x: [0, 10],
    y: [0, 18],
  },
  feature: {
    id: "study-hours",
    label: "Study hours",
  },
  id: "residual-outlier",
  kind: "regression-1d",
  label: "Residual outlier",
  samples: [
    { id: "outlier-1", split: "train", target: 2.2, x: 1 },
    { id: "outlier-2", split: "train", target: 3.1, x: 2 },
    { id: "outlier-3", split: "train", target: 4.5, x: 3 },
    { id: "outlier-4", split: "train", target: 5.2, x: 4 },
    { id: "outlier-5", split: "train", target: 6.7, x: 5 },
    { id: "outlier-6", split: "train", target: 8, x: 6 },
    { id: "outlier-7", split: "train", target: 8.8, x: 7 },
    { id: "outlier-8", split: "train", target: 10.2, x: 8 },
    { id: "outlier-9", split: "train", target: 16.2, x: 8.6 },
  ],
  source: "Synthetic deterministic residual and MSE preset.",
  summary:
    "A mostly linear trend with one high target value that makes squared residuals stand out.",
  target: {
    id: "score",
    label: "Score",
  },
} as const satisfies RegressionDataset1D;

export const RESIDUAL_BALANCED_DATASET = {
  defaultSettings: {
    initialIntercept: 2,
    initialSlope: 0.9,
  },
  domain: {
    x: [0, 10],
    y: [0, 14],
  },
  feature: {
    id: "input",
    label: "Input",
  },
  id: "residual-balanced",
  kind: "regression-1d",
  label: "Balanced residuals",
  samples: [
    { id: "balanced-1", split: "train", target: 2.1, x: 0.8 },
    { id: "balanced-2", split: "train", target: 4.1, x: 1.8 },
    { id: "balanced-3", split: "train", target: 4.4, x: 2.8 },
    { id: "balanced-4", split: "train", target: 6.5, x: 3.8 },
    { id: "balanced-5", split: "train", target: 6.7, x: 4.8 },
    { id: "balanced-6", split: "train", target: 8.7, x: 5.8 },
    { id: "balanced-7", split: "train", target: 8.9, x: 6.8 },
    { id: "balanced-8", split: "train", target: 10.8, x: 7.8 },
    { id: "balanced-9", split: "train", target: 11.2, x: 8.8 },
  ],
  source: "Synthetic deterministic residual and MSE preset.",
  summary:
    "Alternating above-line and below-line points for inspecting residual direction and magnitude.",
  target: {
    id: "target",
    label: "Target",
  },
} as const satisfies RegressionDataset1D;

export const GRADIENT_DESCENT_WELL_CONDITIONED_DATASET = {
  defaultSettings: {
    initialIntercept: -3,
    initialSlope: -0.5,
    iterations: 30,
    learningRate: 0.08,
  },
  domain: {
    x: [-3, 3],
    y: [-6, 8],
  },
  feature: {
    id: "centered-x",
    label: "Centered x",
  },
  id: "gradient-descent-well-conditioned",
  kind: "regression-1d",
  label: "Well-conditioned descent",
  samples: [
    { id: "well-1", split: "train", target: -3.7, x: -3 },
    { id: "well-2", split: "train", target: -2.5, x: -2.2 },
    { id: "well-3", split: "train", target: -1.4, x: -1.4 },
    { id: "well-4", split: "train", target: 0.1, x: -0.6 },
    { id: "well-5", split: "train", target: 1.2, x: 0 },
    { id: "well-6", split: "train", target: 2.1, x: 0.7 },
    { id: "well-7", split: "train", target: 3.3, x: 1.5 },
    { id: "well-8", split: "train", target: 4.9, x: 2.3 },
    { id: "well-9", split: "train", target: 5.8, x: 3 },
  ],
  source: "Synthetic deterministic gradient descent preset.",
  summary:
    "Centered x values make gradient steps smooth and visually stable with a moderate learning rate.",
  target: {
    id: "target",
    label: "Target",
  },
} as const satisfies RegressionDataset1D;

export const GRADIENT_DESCENT_POORLY_SCALED_DATASET = {
  defaultSettings: {
    initialIntercept: 0,
    initialSlope: 0,
    iterations: 40,
    learningRate: 0.0002,
  },
  domain: {
    x: [0, 100],
    y: [0, 130],
  },
  feature: {
    id: "large-scale-x",
    label: "Large-scale x",
  },
  id: "gradient-descent-poorly-scaled",
  kind: "regression-1d",
  label: "Poorly scaled descent",
  samples: [
    { id: "scaled-1", split: "train", target: 8, x: 3 },
    { id: "scaled-2", split: "train", target: 15.5, x: 10 },
    { id: "scaled-3", split: "train", target: 28.2, x: 21 },
    { id: "scaled-4", split: "train", target: 38.5, x: 31 },
    { id: "scaled-5", split: "train", target: 51.7, x: 43 },
    { id: "scaled-6", split: "train", target: 64, x: 55 },
    { id: "scaled-7", split: "train", target: 76.8, x: 67 },
    { id: "scaled-8", split: "train", target: 90.2, x: 78 },
    { id: "scaled-9", split: "train", target: 105.4, x: 92 },
  ],
  source: "Synthetic deterministic gradient descent scaling preset.",
  summary:
    "Large x magnitudes require a much smaller learning rate and reveal scaling sensitivity.",
  target: {
    id: "target",
    label: "Target",
  },
} as const satisfies RegressionDataset1D;

export const REGRESSION_DATASETS = [
  POND_TEMPERATURE_DATASET,
  POND_COOL_FRONT_DATASET,
  RESIDUAL_OUTLIER_DATASET,
  RESIDUAL_BALANCED_DATASET,
  GRADIENT_DESCENT_WELL_CONDITIONED_DATASET,
  GRADIENT_DESCENT_POORLY_SCALED_DATASET,
] as const satisfies readonly RegressionDataset1D[];

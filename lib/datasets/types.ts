export type DatasetSplit = "train" | "validation" | "test";

export type NumericRange = readonly [number, number];

export type DatasetFeature = {
  id: string;
  label: string;
  unit?: string;
};

export type DatasetDomain2D = {
  x: NumericRange;
  y: NumericRange;
};

export type DatasetClass = {
  colorToken: string;
  label: string;
  name: string;
};

export type DigitLabel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Axis2D = "x" | "y";

export type SuggestedAxisSplit2D = {
  axis: Axis2D;
  id: string;
  label: string;
  threshold: number;
};

export type DatasetDefaultSettings = Readonly<
  Record<string, boolean | number | string>
>;

export type ClassificationSample2D = {
  classLabel: string;
  id: string;
  split?: DatasetSplit;
  x: number;
  y: number;
};

export type ClassificationDataset2D = {
  classes: readonly DatasetClass[];
  defaultQuery?: {
    x: number;
    y: number;
  };
  defaultSettings?: DatasetDefaultSettings;
  domain: DatasetDomain2D;
  featureX: DatasetFeature;
  featureY: DatasetFeature;
  id: string;
  kind: "classification-2d";
  label: string;
  samples: readonly ClassificationSample2D[];
  source: string;
  suggestedSplits?: readonly SuggestedAxisSplit2D[];
  summary: string;
};

export type RegressionSample1D = {
  id: string;
  split?: DatasetSplit;
  target: number;
  x: number;
};

export type RegressionDataset1D = {
  defaultSettings?: DatasetDefaultSettings;
  domain: DatasetDomain2D;
  feature: DatasetFeature;
  id: string;
  kind: "regression-1d";
  label: string;
  samples: readonly RegressionSample1D[];
  source: string;
  summary: string;
  target: DatasetFeature;
};

export type DigitDatasetClass = {
  label: DigitLabel;
  name: string;
};

export type DigitImageShape = {
  height: number;
  pixelCount: number;
  width: number;
};

export type DigitImageSample = {
  id: string;
  label: DigitLabel;
  pixelsBase64: string;
  sourceFile: string;
  split?: DatasetSplit;
};

export type DigitDataset = {
  classes: readonly DigitDatasetClass[];
  defaultQueryId: string;
  defaultSettings?: DatasetDefaultSettings;
  id: string;
  image: DigitImageShape;
  kind: "digit-image";
  label: string;
  samples: readonly DigitImageSample[];
  source: string;
  summary: string;
};

export type DatasetPreset =
  | ClassificationDataset2D
  | RegressionDataset1D
  | DigitDataset;

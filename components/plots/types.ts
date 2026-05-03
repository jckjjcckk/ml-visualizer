import type { ScaleLinear } from "d3";

export type PlotRange = readonly [number, number];

export type PlotPoint = {
  x: number;
  y: number;
};

export type PlotDomain = {
  x: PlotRange;
  y: PlotRange;
};

export type PlotMargin = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

export type PlotBounds = {
  height: number;
  innerHeight: number;
  innerWidth: number;
  margin: PlotMargin;
  width: number;
};

export type PlotTransform = {
  bounds: PlotBounds;
  clamp: (point: PlotPoint) => PlotPoint;
  domain: PlotDomain;
  fromScreen: (point: PlotPoint) => PlotPoint;
  toScreen: (point: PlotPoint) => PlotPoint;
  xScale: ScaleLinear<number, number>;
  xTicks: number[];
  yScale: ScaleLinear<number, number>;
  yTicks: number[];
};

export type PlotPointDatum = PlotPoint & {
  ariaLabel?: string;
  fill?: string;
  id: string;
  label?: string;
  radius?: number;
  stroke?: string;
};

export type PlotSegmentDatum = {
  id: string;
  stroke?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export type PlotLineDatum = {
  id: string;
  points: readonly PlotPoint[];
  stroke?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
};

export type PlotRegionDatum =
  | {
      fill?: string;
      id: string;
      kind: "rect";
      opacity?: number;
      stroke?: string;
      x0: number;
      x1: number;
      y0: number;
      y1: number;
    }
  | {
      fill?: string;
      id: string;
      kind: "polygon";
      opacity?: number;
      points: readonly PlotPoint[];
      stroke?: string;
    };

export type PlotLabelDatum = PlotPoint & {
  anchor?: "end" | "middle" | "start";
  fill?: string;
  id: string;
  offsetX?: number;
  offsetY?: number;
  text: string;
  textColor?: string;
  width?: number;
};

export type PlotLegendItem = {
  color: string;
  id?: string;
  label: string;
};

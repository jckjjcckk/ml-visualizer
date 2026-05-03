import { scaleLinear } from "d3";
import type {
  PlotBounds,
  PlotDomain,
  PlotMargin,
  PlotPoint,
  PlotTransform,
} from "@/components/plots/types";

export const DEFAULT_PLOT_MARGIN: PlotMargin = {
  bottom: 52,
  left: 48,
  right: 24,
  top: 24,
};

const clampValue = (value: number, range: readonly [number, number]) => {
  const min = Math.min(range[0], range[1]);
  const max = Math.max(range[0], range[1]);

  return Math.min(max, Math.max(min, value));
};

export function createPlotBounds({
  height,
  margin = DEFAULT_PLOT_MARGIN,
  width,
}: {
  height: number;
  margin?: PlotMargin;
  width: number;
}): PlotBounds {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);

  return {
    height: safeHeight,
    innerHeight: Math.max(1, safeHeight - margin.top - margin.bottom),
    innerWidth: Math.max(1, safeWidth - margin.left - margin.right),
    margin,
    width: safeWidth,
  };
}

export function createPlotTransform({
  domain,
  height,
  margin = DEFAULT_PLOT_MARGIN,
  width,
  xTickCount = 6,
  yTickCount = 5,
}: {
  domain: PlotDomain;
  height: number;
  margin?: PlotMargin;
  width: number;
  xTickCount?: number;
  yTickCount?: number;
}): PlotTransform {
  const bounds = createPlotBounds({ height, margin, width });
  const xScale = scaleLinear()
    .domain([...domain.x])
    .range([bounds.margin.left, bounds.width - bounds.margin.right]);
  const yScale = scaleLinear()
    .domain([...domain.y])
    .range([bounds.height - bounds.margin.bottom, bounds.margin.top]);

  const clamp = (point: PlotPoint): PlotPoint => ({
    x: clampValue(point.x, domain.x),
    y: clampValue(point.y, domain.y),
  });

  return {
    bounds,
    clamp,
    domain,
    fromScreen: (point) =>
      clamp({
        x: xScale.invert(point.x),
        y: yScale.invert(point.y),
      }),
    toScreen: (point) => ({
      x: xScale(point.x),
      y: yScale(point.y),
    }),
    xScale,
    xTicks: xScale.ticks(xTickCount),
    yScale,
    yTicks: yScale.ticks(yTickCount),
  };
}

export function clampPlotPoint(point: PlotPoint, domain: PlotDomain): PlotPoint {
  return {
    x: clampValue(point.x, domain.x),
    y: clampValue(point.y, domain.y),
  };
}

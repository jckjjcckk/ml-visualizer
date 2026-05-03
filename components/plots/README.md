# components/plots

Shared plotting primitives and coordinate helpers live here.

## Contract

- Use one math-style data coordinate system for all 2D ML tools: `x` increases right and `y` increases upward.
- Keep SVG's downward pixel axis inside the shared `PlotTransform`; visualizers should only read/write data coordinates.
- Describe each plot with a `PlotDomain`, optional margins, and reusable datums for points, line segments, regions, labels, and legends.
- Use `ResponsivePlot` for stable dimensions. It owns `ResizeObserver`, viewBox sizing, and D3 scale creation.

## Primitives

- `PlotGrid` and `PlotAxes` render shared frame, tick, and label styling.
- `PlotRegions` supports SVG rectangles and polygons for decision regions and tree leaf regions.
- `PlotSegments` and `PlotLines` render split lines, residuals, fitted lines, and trajectories.
- `PlotPointSeries`, `PlotLabels`, and `PlotLegend` cover common annotation layers without per-tool pixel math.
- `createPlotTransform` and `clampPlotPoint` are pure utilities for tests and non-React code.

## Interaction Helpers

- Visualizers own their own state. Shared helpers only convert browser events to clamped data coordinates.
- Use `getPointerDataPoint` or `createPlotPointerHandlers` for hover/add-point behavior.
- Use `startPlotDrag` for draggable points or query markers.
- Use `createKeyboardNudgeHandler` or `nudgePlotPoint` for arrow-key movement; `ArrowUp` increases data `y`.
- Use `createRafThrottledCallback` around expensive hover/drag/region updates.

## Performance

- Prefer SVG for low-to-medium point counts, overlays, split regions, residuals, and fitted lines.
- Memoize generated regions or decision overlays in the visualizer before passing them into primitives.
- Keep canvas deferred for dense preview layers such as MNIST thumbnails or rasterized decision boundaries.

## Visual Smoke Checks

- Confirm plots are nonblank on the home page and at least one available course route.
- Check desktop and mobile widths for stable framing, readable tick labels, and visible legends.
- Confirm labels, legends, predictions, and controls do not resize or push the plot around.
- Confirm pointer and keyboard interactions stay inside the data domain when a tool uses them.

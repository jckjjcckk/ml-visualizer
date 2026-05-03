import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  SVGProps,
} from "react";
import { clampPlotPoint } from "@/components/plots/scales";
import type {
  PlotDomain,
  PlotPoint,
  PlotTransform,
} from "@/components/plots/types";

type ClientPoint = {
  clientX: number;
  clientY: number;
};

type PlotDragCallbacks = {
  onDrag: (point: PlotPoint, event: PointerEvent | ReactPointerEvent<Element>) => void;
  onEnd?: (point: PlotPoint, event: PointerEvent) => void;
  onStart?: (point: PlotPoint, event: ReactPointerEvent<Element>) => void;
};

type PlotPointerCallbacks = {
  onAddPoint?: (point: PlotPoint, event: ReactPointerEvent<SVGSVGElement>) => void;
  onHover?: (point: PlotPoint, event: ReactPointerEvent<SVGSVGElement>) => void;
  onLeave?: (event: ReactPointerEvent<SVGSVGElement>) => void;
};

export function getDataPointFromClientPoint(
  clientPoint: ClientPoint,
  transform: PlotTransform,
  svg: SVGSVGElement,
): PlotPoint {
  const rect = svg.getBoundingClientRect();
  const scaleX = transform.bounds.width / Math.max(1, rect.width);
  const scaleY = transform.bounds.height / Math.max(1, rect.height);

  return transform.fromScreen({
    x: (clientPoint.clientX - rect.left) * scaleX,
    y: (clientPoint.clientY - rect.top) * scaleY,
  });
}

export function getPointerDataPoint(
  event: ReactPointerEvent<Element>,
  transform: PlotTransform,
  svg = getSvgFromElement(event.currentTarget),
): PlotPoint | null {
  if (!svg) {
    return null;
  }

  return getDataPointFromClientPoint(event, transform, svg);
}

export function startPlotDrag(
  event: ReactPointerEvent<Element>,
  transform: PlotTransform,
  callbacks: PlotDragCallbacks,
) {
  const svg = getSvgFromElement(event.currentTarget);

  if (!svg) {
    return;
  }

  const target = event.currentTarget;
  const pointerId = event.pointerId;

  event.preventDefault();
  target.setPointerCapture?.(pointerId);

  const startPoint = getDataPointFromClientPoint(event, transform, svg);
  if (callbacks.onStart) {
    callbacks.onStart(startPoint, event);
  } else {
    callbacks.onDrag(startPoint, event);
  }

  const handlePointerMove = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== pointerId) {
      return;
    }

    callbacks.onDrag(
      getDataPointFromClientPoint(moveEvent, transform, svg),
      moveEvent,
    );
  };

  const handlePointerUp = (upEvent: PointerEvent) => {
    if (upEvent.pointerId !== pointerId) {
      return;
    }

    svg.ownerDocument.removeEventListener("pointermove", handlePointerMove);
    svg.ownerDocument.removeEventListener("pointerup", handlePointerUp);
    svg.ownerDocument.removeEventListener("pointercancel", handlePointerUp);
    target.releasePointerCapture?.(pointerId);

    if (callbacks.onEnd) {
      callbacks.onEnd(
        getDataPointFromClientPoint(upEvent, transform, svg),
        upEvent,
      );
    }
  };

  svg.ownerDocument.addEventListener("pointermove", handlePointerMove);
  svg.ownerDocument.addEventListener("pointerup", handlePointerUp);
  svg.ownerDocument.addEventListener("pointercancel", handlePointerUp);
}

export function createPlotPointerHandlers(
  transform: PlotTransform,
  callbacks: PlotPointerCallbacks,
): Pick<
  SVGProps<SVGSVGElement>,
  "onPointerDown" | "onPointerLeave" | "onPointerMove"
> {
  return {
    onPointerDown: callbacks.onAddPoint
      ? (event) => {
          const point = getPointerDataPoint(event, transform);

          if (point) {
            callbacks.onAddPoint?.(point, event);
          }
        }
      : undefined,
    onPointerLeave: callbacks.onLeave,
    onPointerMove: callbacks.onHover
      ? (event) => {
          const point = getPointerDataPoint(event, transform);

          if (point) {
            callbacks.onHover?.(point, event);
          }
        }
      : undefined,
  };
}

export function nudgePlotPoint({
  domain,
  event,
  point,
  shiftMultiplier = 5,
  step,
}: {
  domain: PlotDomain;
  event: Pick<KeyboardEvent | ReactKeyboardEvent<Element>, "key" | "shiftKey">;
  point: PlotPoint;
  shiftMultiplier?: number;
  step: PlotPoint;
}): PlotPoint {
  const multiplier = event.shiftKey ? shiftMultiplier : 1;

  if (event.key === "ArrowLeft") {
    return clampPlotPoint({ ...point, x: point.x - step.x * multiplier }, domain);
  }

  if (event.key === "ArrowRight") {
    return clampPlotPoint({ ...point, x: point.x + step.x * multiplier }, domain);
  }

  if (event.key === "ArrowDown") {
    return clampPlotPoint({ ...point, y: point.y - step.y * multiplier }, domain);
  }

  if (event.key === "ArrowUp") {
    return clampPlotPoint({ ...point, y: point.y + step.y * multiplier }, domain);
  }

  return point;
}

export function createKeyboardNudgeHandler({
  domain,
  onNudge,
  point,
  shiftMultiplier,
  step,
}: {
  domain: PlotDomain;
  onNudge: (point: PlotPoint) => void;
  point: PlotPoint;
  shiftMultiplier?: number;
  step: PlotPoint;
}) {
  return (event: ReactKeyboardEvent<Element>) => {
    const nextPoint = nudgePlotPoint({
      domain,
      event,
      point,
      shiftMultiplier,
      step,
    });

    if (nextPoint.x === point.x && nextPoint.y === point.y) {
      return;
    }

    event.preventDefault();
    onNudge(nextPoint);
  };
}

export type RafThrottledCallback<T extends unknown[]> = ((...args: T) => void) & {
  cancel: () => void;
};

export function createRafThrottledCallback<T extends unknown[]>(
  callback: (...args: T) => void,
): RafThrottledCallback<T> {
  let frameId: number | null = null;
  let latestArgs: T | null = null;

  const throttled = ((...args: T) => {
    latestArgs = args;

    if (frameId !== null) {
      return;
    }

    if (typeof window === "undefined") {
      callback(...args);
      latestArgs = null;
      return;
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = null;

      if (latestArgs) {
        callback(...latestArgs);
        latestArgs = null;
      }
    });
  }) as RafThrottledCallback<T>;

  throttled.cancel = () => {
    if (frameId !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(frameId);
    }

    frameId = null;
    latestArgs = null;
  };

  return throttled;
}

function getSvgFromElement(element: EventTarget & Element): SVGSVGElement | null {
  if (element instanceof SVGSVGElement) {
    return element;
  }

  if (element instanceof SVGElement) {
    return element.ownerSVGElement;
  }

  return null;
}

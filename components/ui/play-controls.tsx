"use client";

import { Pause, Play, StepBack, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

type PlayControlsProps = {
  className?: string;
  disabled?: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepBackward?: () => void;
  onStepForward?: () => void;
};

const controlButtonClass =
  "flex size-8 items-center justify-center rounded-full border border-border bg-inset text-[var(--text-secondary)] transition-colors duration-150 hover:border-border-strong hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-[var(--text-muted)] disabled:opacity-60";

export function PlayControls({
  className,
  disabled = false,
  isPlaying,
  onPlayPause,
  onStepBackward,
  onStepForward,
}: PlayControlsProps) {
  const PlayPauseIcon = isPlaying ? Pause : Play;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onStepBackward ? (
        <Tooltip content="Step backward">
          <button
            type="button"
            aria-label="Step backward"
            className={controlButtonClass}
            disabled={disabled}
            onClick={onStepBackward}
          >
            <StepBack aria-hidden="true" className="size-4" />
          </button>
        </Tooltip>
      ) : null}

      <Tooltip content={isPlaying ? "Pause" : "Play"}>
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          aria-pressed={isPlaying}
          className={cn(controlButtonClass, "bg-panel-raised")}
          disabled={disabled}
          onClick={onPlayPause}
        >
          <PlayPauseIcon aria-hidden="true" className="size-4" />
        </button>
      </Tooltip>

      {onStepForward ? (
        <Tooltip content="Step forward">
          <button
            type="button"
            aria-label="Step forward"
            className={controlButtonClass}
            disabled={disabled}
            onClick={onStepForward}
          >
            <StepForward aria-hidden="true" className="size-4" />
          </button>
        </Tooltip>
      ) : null}
    </div>
  );
}

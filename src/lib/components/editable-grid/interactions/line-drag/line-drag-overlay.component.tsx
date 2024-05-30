import { type LineOverlayProps } from "$/lib/components/editable-grid/editable-grid-overlay.model";
import { useGrid } from "$/lib/components/editable-grid/editable-grid.context";
import {
  GridLineAxis,
  gridLineKeyboardMoveDistance,
} from "$/lib/components/editable-grid/editable-grid.model";
import {
  getContainerSizeInAxis,
  getNewLinePosition,
} from "$/lib/components/editable-grid/editable-grid.utils";
import { EditableGridLineDragInteraction } from "$/lib/components/editable-grid/interactions/line-drag/line-drag.interaction";
import { cn } from "$/lib/utils/shadcnui";
import { useStore } from "$/lib/utils/store/useStore";

export const LineDragOverlay = ({ line, lineBounds }: LineOverlayProps) => {
  const grid = useGrid();

  const axis = lineBounds?.line ? grid.findLineAxis(lineBounds.line) : null;

  const interactionStack = useStore(
    grid.interactionStack,
    grid.interactionStack,
  );

  const dragInteraction = interactionStack.getByType(
    EditableGridLineDragInteraction,
  );
  const isDragged =
    dragInteraction?.data?.line?.name === lineBounds?.line.name &&
    dragInteraction?.data?.axis === axis;

  const handleMouseDown = () => {
    if (!axis) return;

    const existingInteraction = interactionStack.getByType(
      EditableGridLineDragInteraction,
    );

    if (existingInteraction) existingInteraction.cancel();

    const interaction = new EditableGridLineDragInteraction({
      stack: grid.interactionStack,
      initialData: {
        line,
        axis,
        grid,
      },
    });
    interaction.start();
  };

  const handleLineKeyboardMove = (event: React.KeyboardEvent) => {
    if (!axis) return;
    if (!grid.gridContainer) return;
    if (
      axis === GridLineAxis.Col &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    )
      return;
    if (
      axis === GridLineAxis.Row &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown"
    )
      return;

    const isIncrement = event.key === "ArrowRight" || event.key === "ArrowDown";
    const movementAxisMultiplier = isIncrement ? 1 : -1;
    const pixelPositionOffset =
      movementAxisMultiplier * gridLineKeyboardMoveDistance;
    const relativePositionOffset =
      pixelPositionOffset / getContainerSizeInAxis(axis, grid.gridContainer);
    const requestedPosition = line.position + relativePositionOffset;

    const newPosition = getNewLinePosition({
      requestedPosition,
      line,
      cells: grid.getCells(),
      lines: grid.getLines(),
      axis,
      gridContainer: grid.gridContainer,
    });

    grid.moveLine(line, newPosition);
  };

  return (
    <>
      {axis === GridLineAxis.Row ? (
        <div
          className="group absolute left-0 right-0 top-[calc(var(--grid-line-area)/-2)] h-[--grid-line-area] cursor-row-resize select-none [--grid-line-area:10px]"
          role="separator"
          aria-valuenow={line.position * 100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-orientation="horizontal"
          tabIndex={0}
          onKeyDown={handleLineKeyboardMove}
          onMouseDown={handleMouseDown}
        >
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 top-0 my-auto h-[2px] transition-all group-hover:bg-accent",
              isDragged && "bg-accent",
            )}
          />
        </div>
      ) : (
        <div
          className="group pointer-events-auto absolute bottom-0 left-[calc(var(--grid-line-area)/-2)] top-0 w-[--grid-line-area] cursor-col-resize select-none [--grid-line-area:10px]"
          role="separator"
          aria-valuenow={line.position * 100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-orientation="vertical"
          tabIndex={0}
          onKeyDown={handleLineKeyboardMove}
          onMouseDown={handleMouseDown}
        >
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 top-0 mx-auto w-[2px] transition-all group-hover:bg-accent",
              isDragged && "bg-accent",
            )}
          />
        </div>
      )}
    </>
  );
};

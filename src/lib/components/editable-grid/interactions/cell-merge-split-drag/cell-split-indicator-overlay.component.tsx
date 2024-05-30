import { type CustomOverlayProps } from "$/lib/components/editable-grid/editable-grid-overlay.model";
import { useGrid } from "$/lib/components/editable-grid/editable-grid.context";
import { GridLineAxis } from "$/lib/components/editable-grid/editable-grid.model";
import { EditableGridCellMergeDragInteraction } from "$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-drag.interaction";
import { calculateSplitPositionAndAxis } from "$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split.utils";
import { useStore } from "$/lib/utils/store/useStore";
import { useState } from "react";

export const CellSplitIndicatorOverlay: React.FC<CustomOverlayProps> = ({
  overlay,
}) => {
  const grid = useGrid();
  const interactionStack = useStore(
    grid.interactionStack,
    grid.interactionStack,
  );

  const interaction = interactionStack.getByType(
    EditableGridCellMergeDragInteraction,
  );
  const cell = interaction?.data.fromCell;

  const [showLine, setShowLine] = useState(false);
  const [lineAxis, setLineAxis] = useState(GridLineAxis.Col);
  const [linePosition, setLinePosition] = useState(0);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interaction) return;
    if (!grid.gridContainer) return;
    if (!cell) return;

    grid.events.cell.mouseMove.emit({ cell, originalEvent: event });

    const { startX, startY } = interaction.data;
    const { clientX, clientY, target } = event;

    if (target instanceof HTMLElement === false) return;

    const splitCoords = calculateSplitPositionAndAxis({
      startX,
      startY,
      clientX,
      clientY,
      target,
      cell,
      grid,
    });

    if (splitCoords == null) {
      setShowLine(false);
      return;
    }

    setLineAxis(splitCoords.axis);
    setLinePosition(splitCoords.position);
    setShowLine(true);
  };

  if (!cell) return null;

  return (
    <div
      style={{
        gridRowStart: cell.bounds.row.start.name,
        gridRowEnd: cell.bounds.row.end.name,
        gridColumnStart: cell.bounds.col.start.name,
        gridColumnEnd: cell.bounds.col.end.name,
        zIndex: overlay.zIndex,
        pointerEvents: overlay.pointerEvents,
      }}
      className="relative opacity-50"
      onMouseMove={handleMouseMove}
      role="presentation"
    >
      {showLine &&
        (lineAxis === GridLineAxis.Row ? (
          <div
            style={{ top: `${linePosition * 100}%` }}
            className="absolute left-0 right-0 h-[2px] bg-accent-foreground"
          ></div>
        ) : (
          <div
            style={{ left: `${linePosition * 100}%` }}
            className="absolute bottom-0 top-0 w-[2px] bg-accent-foreground"
          ></div>
        ))}
    </div>
  );
};

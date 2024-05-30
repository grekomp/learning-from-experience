import { type CustomOverlayProps } from "$/lib/components/editable-grid/editable-grid-overlay.model";
import { useGrid } from "$/lib/components/editable-grid/editable-grid.context";
import { EditableGridCellMergeDragInteraction } from "$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-drag.interaction";
import { useStore } from "$/lib/utils/store/useStore";

export const CellMergeIndicatorOverlay: React.FC<CustomOverlayProps> = ({
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
  const fromCell = interaction?.data.fromCell;
  const toCell = interaction?.data.toCell;

  const canMerge =
    fromCell && toCell ? grid.canMergeCells(fromCell, toCell) : false;

  if (!canMerge || !toCell) return null;

  return (
    <div
      style={{
        gridRowStart: toCell.bounds.row.start.name,
        gridRowEnd: toCell.bounds.row.end.name,
        gridColumnStart: toCell.bounds.col.start.name,
        gridColumnEnd: toCell.bounds.col.end.name,
        zIndex: overlay.zIndex,
        pointerEvents: overlay.pointerEvents,
      }}
      className="z-40 bg-neutral-900 opacity-80"
    />
  );
};

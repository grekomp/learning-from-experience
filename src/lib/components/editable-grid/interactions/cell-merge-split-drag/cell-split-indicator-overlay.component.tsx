import { type CustomOverlayProps } from "$/lib/components/editable-grid/editable-grid-overlay.model";
import { useGrid } from "$/lib/components/editable-grid/editable-grid.context";
import { GridLineAxis } from "$/lib/components/editable-grid/editable-grid.model";
import { EditableGridCellMergeDragInteraction } from "$/lib/components/editable-grid/interactions/cell-merge-split-drag/cell-merge-split-drag.interaction";
import { useListenable } from "$/lib/utils/emitter-listenable/use-listenable";
import { cn } from "$/lib/utils/shadcnui";

export const CellSplitIndicatorOverlay: React.FC<CustomOverlayProps> = ({
  overlay,
}) => {
  const grid = useGrid();
  const interactionStack = useListenable(
    grid.interactionStack.onChange,
    grid.interactionStack,
  );

  const interaction = interactionStack.getByType(
    EditableGridCellMergeDragInteraction,
  );
  const cell = interaction?.data.fromCell;
  const splitCoords = interaction?.data.splitCoords;
  const placeNewCellFirst = interaction?.shouldPlaceNewCellFirst();

  if (!cell || !splitCoords) return null;

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
      className="relative"
      role="presentation"
    >
      <div
        className={cn("absolute bg-accent/35", {
          ["width-full left-0 right-0"]: splitCoords.axis === GridLineAxis.Row,
          ["height-full bottom-0 top-0"]: splitCoords.axis === GridLineAxis.Col,
          ["top-0"]: splitCoords.axis === GridLineAxis.Row && placeNewCellFirst,
          ["bottom-0"]:
            splitCoords.axis === GridLineAxis.Row && !placeNewCellFirst,
          ["left-0"]:
            splitCoords.axis === GridLineAxis.Col && placeNewCellFirst,
          ["right-0"]:
            splitCoords.axis === GridLineAxis.Col && !placeNewCellFirst,
        })}
        style={
          splitCoords.axis === GridLineAxis.Row
            ? {
                height: `${(placeNewCellFirst ? splitCoords.position : 1 - splitCoords.position) * 100}%`,
              }
            : {
                width: `${(placeNewCellFirst ? splitCoords.position : 1 - splitCoords.position) * 100}%`,
              }
        }
      ></div>
      {splitCoords.axis === GridLineAxis.Row ? (
        <div
          style={{ top: `${splitCoords.position * 100}%` }}
          className="absolute left-0 right-0 h-[2px] bg-accent-foreground/50"
        ></div>
      ) : (
        <div
          style={{ left: `${splitCoords.position * 100}%` }}
          className="absolute bottom-0 top-0 w-[2px] bg-accent-foreground/50"
        ></div>
      )}
    </div>
  );
};

import {
  type EditableGridOverlayDataFor,
  type OverlayTargetType,
} from "$/lib/components/editable-grid/editable-grid-overlay.model";
import {
  useGrid,
  useGridCells,
} from "$/lib/components/editable-grid/editable-grid.context";
import React, { useMemo } from "react";

export interface CellsOverlayRendererProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Cells>;
}

export const CellsOverlayRenderer: React.FC<CellsOverlayRendererProps> = ({
  overlay,
}) => {
  const grid = useGrid();
  const cells = useGridCells();

  const target = useMemo(
    () => overlay.target ?? cells,
    [cells, overlay.target],
  );

  const Component = overlay.component ?? React.Fragment;

  return (
    <>
      {target?.map((cell, index) => (
        <div
          key={index}
          className={"group relative"}
          role="presentation"
          style={{
            gridColumnStart: cell.bounds.col.start.name,
            gridColumnEnd: cell.bounds.col.end.name,
            gridRowStart: cell.bounds.row.start.name,
            gridRowEnd: cell.bounds.row.end.name,
            zIndex: overlay.zIndex,
            pointerEvents: overlay.pointerEvents,
          }}
          onClick={(event) =>
            grid?.events.cell.click.emit({ cell, originalEvent: event })
          }
          onMouseEnter={(event) =>
            grid?.events.cell.mouseEnter.emit({ cell, originalEvent: event })
          }
          onMouseMove={(event) =>
            grid?.events.cell.mouseMove.emit({ cell, originalEvent: event })
          }
          onMouseLeave={(event) =>
            grid?.events.cell.mouseLeave.emit({ cell, originalEvent: event })
          }
        >
          <Component overlay={overlay} cell={cell} />
        </div>
      ))}
    </>
  );
};

import {
  type EditableGridOverlayDataFor,
  type OverlayTargetType,
} from "$/lib/components/editable-grid/editable-grid-overlay.model";
import {
  useGrid,
  useGridLineNames,
} from "$/lib/components/editable-grid/editable-grid.context";
import {
  GridLineAxis,
  gridBoundingLines,
} from "$/lib/components/editable-grid/editable-grid.model";
import { isMiddleGridLineName } from "$/lib/components/editable-grid/editable-grid.utils";
import React, { memo, useMemo } from "react";

export interface LinesOverlayRendererProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Lines>;
}

export const LinesOverlayRenderer: React.FC<LinesOverlayRendererProps> = memo(
  function LinesOverlayRenderer({ overlay }) {
    const grid = useGrid();
    const lines = useGridLineNames();

    const useLineBounds = overlay.options?.useLineBounds ?? true;
    const target = useMemo(
      () =>
        (overlay.target ?? lines.filter(isMiddleGridLineName)).map(
          (lineName) => {
            const line = grid.findLine(lineName);

            return {
              lineName: lineName,
              bounds: line && grid.getLineBounds(line),
            };
          },
        ),
      [overlay.target, lines, grid],
    );

    return (
      <>
        {target.map(({ lineName: lineName, bounds }) => {
          const line = grid.findLine(lineName);
          if (!line) return null;

          const axis = grid.findLineAxis(line);
          const lineBounds = (useLineBounds && bounds) || null;
          const Component = overlay.component ?? React.Fragment;

          if (axis === GridLineAxis.Row) {
            return (
              <div
                key={lineName}
                className="pointer-events-none relative"
                style={{
                  gridRowStart: lineName,
                  gridRowEnd: gridBoundingLines.row.end,
                  gridColumnStart:
                    lineBounds?.start ?? gridBoundingLines.col.start,
                  gridColumnEnd: lineBounds?.end ?? gridBoundingLines.col.end,
                  zIndex: overlay.zIndex,
                }}
              >
                <div
                  className="relative h-0 w-full"
                  style={{
                    pointerEvents: overlay.pointerEvents,
                  }}
                >
                  <Component
                    overlay={overlay}
                    lineName={lineName}
                    lineBounds={lineBounds}
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={lineName}
              className="pointer-events-none relative"
              style={{
                gridRowStart: lineBounds?.start ?? gridBoundingLines.row.start,
                gridRowEnd: lineBounds?.end ?? gridBoundingLines.row.end,
                gridColumnStart: lineName,
                gridColumnEnd: gridBoundingLines.col.end,
                zIndex: overlay.zIndex,
              }}
            >
              <div
                className="relative h-full w-0"
                style={{
                  pointerEvents: overlay.pointerEvents,
                }}
              >
                <Component
                  overlay={overlay}
                  lineName={lineName}
                  lineBounds={lineBounds}
                />
              </div>
            </div>
          );
        })}
      </>
    );
  },
);

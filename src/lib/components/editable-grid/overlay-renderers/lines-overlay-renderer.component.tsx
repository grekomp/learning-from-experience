import {
  type EditableGridOverlayDataFor,
  type OverlayTargetType,
} from "$/lib/components/editable-grid/editable-grid-overlay.model";
import {
  useGrid,
  useGridLines,
} from "$/lib/components/editable-grid/editable-grid.context";
import {
  GridLineAxis,
  gridEndLine,
  gridStartLine,
} from "$/lib/components/editable-grid/editable-grid.model";
import React, { useMemo } from "react";

export interface LinesOverlayRendererProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Lines>;
}

export const LinesOverlayRenderer: React.FC<LinesOverlayRendererProps> = ({
  overlay,
}) => {
  const grid = useGrid();
  const lines = useGridLines();

  const useLineBounds = overlay.options?.useLineBounds ?? true;
  const target = useMemo(
    () =>
      overlay.target ??
      [...lines.col, ...lines.row].filter(
        (line) => line.name !== gridStartLine && line.name !== gridEndLine,
      ),
    [overlay.target, lines],
  );

  return (
    <>
      {target.map((line) => {
        const axis = grid?.findLineAxis(line);
        const lineBounds = (useLineBounds && grid?.getLineBounds(line)) || null;
        const Component = overlay.component ?? React.Fragment;

        if (axis === GridLineAxis.Row) {
          return (
            <div
              key={axis + line.name}
              className="pointer-events-none relative"
              style={{
                gridRowStart: line.name,
                gridRowEnd: gridEndLine,
                gridColumnStart: lineBounds?.start.name ?? gridStartLine,
                gridColumnEnd: lineBounds?.end.name ?? gridEndLine,
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
                  line={line}
                  lineBounds={lineBounds}
                />
              </div>
            </div>
          );
        }

        return (
          <div
            key={axis + line.name}
            className="pointer-events-none relative"
            style={{
              gridRowStart: lineBounds?.start.name ?? gridStartLine,
              gridRowEnd: lineBounds?.end.name ?? gridEndLine,
              gridColumnStart: line.name,
              gridColumnEnd: gridEndLine,
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
                line={line}
                lineBounds={lineBounds}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

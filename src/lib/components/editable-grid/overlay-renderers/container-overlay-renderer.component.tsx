import {
  type EditableGridOverlayDataFor,
  type OverlayTargetType,
} from "$/lib/components/editable-grid/editable-grid-overlay.model";
import { gridBoundingLines } from "$/lib/components/editable-grid/editable-grid.model";
import React from "react";

export interface ContainerOverlayRendererProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Container>;
}

export const ContainerOverlayRenderer: React.FC<
  ContainerOverlayRendererProps
> = ({ overlay }) => {
  const Component = overlay.component;

  return (
    <div
      role="presentation"
      style={{
        gridRowStart: gridBoundingLines.row.start,
        gridRowEnd: gridBoundingLines.row.end,
        gridColumnStart: gridBoundingLines.col.start,
        gridColumnEnd: gridBoundingLines.col.end,
        zIndex: overlay.zIndex,
        pointerEvents: overlay.pointerEvents,
      }}
      className="relative"
    >
      {Component && <Component overlay={overlay} />}
    </div>
  );
};

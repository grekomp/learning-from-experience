import { useGrid } from "$/lib/components/editable-grid/editable-grid.context";
import { OverlayRenderer } from "$/lib/components/editable-grid/overlay-renderers/overlay-renderer.component";
import { memo } from "react";

export const GridOverlaysRenderer = memo(function GridOverlaysRenderer() {
  const grid = useGrid();

  return (
    <>
      {grid.getOverlays().map((overlay, index) => (
        <OverlayRenderer key={index} overlay={overlay} />
      ))}
    </>
  );
});

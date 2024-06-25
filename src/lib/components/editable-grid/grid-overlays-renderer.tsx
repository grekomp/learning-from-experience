import { useGridOverlays } from "$/lib/components/editable-grid/editable-grid.context";
import { OverlayRenderer } from "$/lib/components/editable-grid/overlay-renderers/overlay-renderer.component";
import { memo } from "react";

export const GridOverlaysRenderer = memo(function GridOverlaysRenderer() {
  const overlays = useGridOverlays();

  return (
    <>
      {overlays.map((overlay) => (
        <OverlayRenderer key={overlay.id} overlay={overlay} />
      ))}
    </>
  );
});

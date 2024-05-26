import {
  OverlayTargetType,
  type EditableGridOverlayData,
} from "$/lib/components/editable-grid/editable-grid-overlay.model";
import { CellsOverlayRenderer } from "$/lib/components/editable-grid/overlay-renderers/cells-overlay-renderer.component";
import { LinesOverlayRenderer } from "$/lib/components/editable-grid/overlay-renderers/lines-overlay-renderer.component";
import { useMemo } from "react";

export interface OverlayRendererProps {
  overlay: EditableGridOverlayData;
}

export const OverlayRenderer: React.FC<OverlayRendererProps> = ({
  overlay,
}) => {
  const overlayWithDefaults = useMemo(
    () => ({
      ...overlay,
      zIndex: overlay.zIndex ?? 0,
      pointerEvents: overlay.pointerEvents ?? "auto",
    }),
    [overlay],
  );

  return (
    <div className="contents">
      {overlayWithDefaults.targetType === OverlayTargetType.Cells && (
        <CellsOverlayRenderer overlay={overlayWithDefaults} />
      )}
      {overlayWithDefaults.targetType === OverlayTargetType.Lines && (
        <LinesOverlayRenderer overlay={overlayWithDefaults} />
      )}
    </div>
  );
};

import { EditableGridCell } from "$/lib/components/editable-grid/editable-grid-cell.component";
import { type EditableGridController } from "$/lib/components/editable-grid/editable-grid-controller";
import { EditableGridContext } from "$/lib/components/editable-grid/editable-grid.context";
import { getCssGridTemplateFromGridLines } from "$/lib/components/editable-grid/editable-grid.utils";
import { OverlayRenderer } from "$/lib/components/editable-grid/overlay-renderers/overlay-renderer.component";
import { useStore } from "$/lib/utils/store/useStore";

export interface EditableGridProps {
  grid: EditableGridController;
}

export const EditableGrid: React.FC<EditableGridProps> = ({ grid }) => {
  useStore(grid, null);

  return (
    <EditableGridContext.Provider value={grid}>
      <div
        className="relative grid h-full w-full [--grid-gap:4px]"
        style={{
          gridTemplate: getCssGridTemplateFromGridLines(grid.getLines()),
        }}
        ref={grid.setContainer}
        onMouseMove={(event) =>
          grid.events.container.mouseMove.emit(event.nativeEvent)
        }
        role="grid"
        tabIndex={0}
      >
        {grid.getCells().map((cell, index) => (
          <EditableGridCell key={index} cell={cell} />
        ))}

        {grid.getOverlays().map((overlay, index) => (
          <OverlayRenderer key={index} overlay={overlay} />
        ))}
      </div>
    </EditableGridContext.Provider>
  );
};

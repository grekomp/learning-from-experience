import { type EditableGridController } from "$/lib/components/editable-grid/editable-grid-controller";
import { EditableGridContext } from "$/lib/components/editable-grid/editable-grid.context";
import { getCssGridTemplateFromGridLines } from "$/lib/components/editable-grid/editable-grid.utils";
import { GridCellsRenderer } from "$/lib/components/editable-grid/grid-cells-renderer.component";
import { GridOverlaysRenderer } from "$/lib/components/editable-grid/grid-overlays-renderer";
import { useListenable } from "$/lib/utils/emitter-listenable/use-listenable";

export interface EditableGridProps {
  grid: EditableGridController;
}

export const EditableGrid: React.FC<EditableGridProps> = ({ grid }) => {
  useListenable(grid.onChange, grid);

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
        <GridCellsRenderer />
        <GridOverlaysRenderer />
      </div>
    </EditableGridContext.Provider>
  );
};

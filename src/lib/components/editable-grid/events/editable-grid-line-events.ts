import type { EditableGridLine } from "$/lib/components/editable-grid/editable-grid.model";

export interface EditableGridLineMouseEventData {
  cell: EditableGridLine;
  originalEvent: MouseEvent;
}

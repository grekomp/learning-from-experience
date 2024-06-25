import type {
  EditableGridCellBounds,
  EditableGridCellData,
  EditableGridLineId,
  LineBounds,
} from "$/lib/components/editable-grid/editable-grid.model";

export type EditableGridOverlayData = {
  id: string;
  zIndex?: number;
  /**
   * Controls the value of the CSS property `pointer-events` on the overlay element.
   *
   * @default 'auto'
   */
  pointerEvents?: "auto" | "none";
} & (
  | {
      targetType: OverlayTargetType.Cells;
      component?: React.ComponentType<CellOverlayProps>;
      target?: Readonly<EditableGridCellData[]>;
    }
  | {
      targetType: OverlayTargetType.Lines;
      target?: Readonly<EditableGridLineId[]>;
      component?: React.ComponentType<LineOverlayProps>;
      options?: {
        /**
         * If true, the overlay will be bounded to the cells that each line borders.
         *
         * @default true
         */
        useLineBounds?: boolean;
      };
    }
  | {
      targetType: OverlayTargetType.Areas;
      component?: React.ComponentType<AreaOverlayProps>;
      target: Readonly<EditableGridCellBounds[]>;
    }
  | {
      targetType: OverlayTargetType.Container;
      component?: React.ComponentType<ContainerOverlayProps>;
      target?: never;
    }
  | {
      targetType: OverlayTargetType.Custom;
      component?: React.ComponentType<CustomOverlayProps>;
      target?: never;
    }
);

export type EditableGridOverlayDataFor<TargetType extends OverlayTargetType> =
  EditableGridOverlayData & { targetType: TargetType };

export interface LineOverlayProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Lines>;
  lineName: EditableGridLineId;
  lineBounds: LineBounds | null;
}

export interface CellOverlayProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Cells>;
  cell: EditableGridCellData;
}

export interface AreaOverlayProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Areas>;
  bounds: EditableGridCellBounds;
}

export interface ContainerOverlayProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Container>;
}

export interface CustomOverlayProps {
  overlay: EditableGridOverlayDataFor<OverlayTargetType.Custom>;
}

export enum OverlayTargetType {
  Cells = "Cells",
  Lines = "Lines",
  Areas = "Areas",
  Container = "Container",
  Custom = "Custom",
}

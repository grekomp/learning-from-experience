import type {
	EditableGridCellBounds,
	EditableGridCellData,
	EditableGridLine,
} from '$lib/components/editable-grid/editable-grid.model';
import type { ComponentType } from 'svelte';

export type EditableGridOverlayData = {
	component: ComponentType | null;
	zIndex?: number;
	/**
	 * Controls the value of the CSS property `pointer-events` on the overlay element.
	 *
	 * @default 'auto'
	 */
	pointerEvents?: 'auto' | 'none';
} & (
	| {
			targetType: OverlayTargetType.Cells;
			target?: Readonly<EditableGridCellData[]>;
	  }
	| {
			targetType: OverlayTargetType.Lines;
			target?: Readonly<EditableGridLine[]>;
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
			target: Readonly<EditableGridCellBounds[]>;
	  }
	| {
			targetType: OverlayTargetType.Container;
			target?: never;
	  }
	| {
			targetType: OverlayTargetType.Custom;
			target?: never;
	  }
);

export type EditableGridOverlayDataFor<TargetType extends OverlayTargetType> =
	EditableGridOverlayData & { targetType: TargetType };

export enum OverlayTargetType {
	Cells = 'Cells',
	Lines = 'Lines',
	Areas = 'Areas',
	Container = 'Container',
	Custom = 'Custom',
}

import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
import {
	OverlayTargetType,
	type EditableGridOverlayDataFor,
} from '$lib/components/editable-grid/editable-grid-overlay.model';
import {
	gridEvents,
	type EditableGridCellData,
} from '$lib/components/editable-grid/editable-grid.model';
import CellMergeDragOverlay from '$lib/components/editable-grid/interactions/cell-merge-drag/cell-merge-drag-overlay.svelte';
import { InteractionBase } from '$lib/modules/interaction-stack/interaction-base';
import type { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
import type { DataTypeOf } from '@grekomp/wonder-event-emitter';

export interface EditableGridCellMergeDragInteractionData {
	grid: EditableGridController;
	fromCell: EditableGridCellData;
	toCell?: EditableGridCellData;
	containerOverlay?: EditableGridOverlayDataFor<OverlayTargetType.Container>;
	cellsOverlay?: EditableGridOverlayDataFor<OverlayTargetType.Cells>;
	mergeAreaOverlay?: EditableGridOverlayDataFor<OverlayTargetType.Custom>;
}

export const editableGridCellMergeDragInteractionType =
	'EditableGridCellMergeDragInteraction' as const;

export class EditableGridCellMergeDragInteraction extends InteractionBase<
	EditableGridCellMergeDragInteraction,
	typeof editableGridCellMergeDragInteractionType,
	EditableGridCellMergeDragInteractionData
> {
	constructor(stack: InteractionStack, data: EditableGridCellMergeDragInteractionData) {
		super(stack, data, editableGridCellMergeDragInteractionType);

		this.onCellMouseEnter = this.onCellMouseEnter.bind(this);
		this.onCellClick = this.onCellClick.bind(this);
	}

	setTargetCell(cell: EditableGridCellData) {
		if (cell === this.data.fromCell) {
			this.data = { ...this.data, toCell: undefined };
			return;
		}

		this.data = { ...this.data, toCell: cell };
	}

	_onStart() {
		this.data.grid.eventEmitter.on(gridEvents.cell.mouseEnter, this.onCellMouseEnter);
		this.data.grid.eventEmitter.on(gridEvents.cell.click, this.onCellClick);
		this.data.containerOverlay = {
			targetType: OverlayTargetType.Container,
			component: null,
		};
		this.data.cellsOverlay = {
			targetType: OverlayTargetType.Cells,
			target: this.data.grid.getCells(),
			component: null,
			zIndex: 10,
		};
		this.data.mergeAreaOverlay = {
			targetType: OverlayTargetType.Custom,
			component: CellMergeDragOverlay,
			zIndex: 20,
		};

		this.data.grid.addOverlay(this.data.containerOverlay);
		this.data.grid.addOverlay(this.data.cellsOverlay);
		this.data.grid.addOverlay(this.data.mergeAreaOverlay);

		this.data = { ...this.data };
	}
	_onComplete() {
		if (this.data.fromCell && this.data.toCell) {
			this.data.grid.mergeCells(this.data.fromCell, this.data.toCell);
		}
	}
	_onDispose() {
		this.data.grid.eventEmitter.off(gridEvents.cell.mouseEnter, this.onCellMouseEnter);
		this.data.grid.eventEmitter.off(gridEvents.cell.click, this.onCellClick);
		this.data.grid.removeOverlay(this.data.containerOverlay);
		this.data.grid.removeOverlay(this.data.cellsOverlay);
		this.data.grid.removeOverlay(this.data.mergeAreaOverlay);
	}

	onCellMouseEnter({ cell }: DataTypeOf<typeof gridEvents.cell.mouseEnter>) {
		this.setTargetCell(cell);
	}
	onCellClick() {
		this.complete();
	}
}

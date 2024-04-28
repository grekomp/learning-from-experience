import type { EditableGridController } from '$lib/components/editable-grid/editable-grid-controller';
import {
	OverlayTargetType,
	type EditableGridOverlayData,
} from '$lib/components/editable-grid/editable-grid-overlay.model';
import {
	GridLineAxis,
	gridEvents,
	type EditableGridLine,
} from '$lib/components/editable-grid/editable-grid.model';
import {
	calculateRelativePosition,
	getNewLinePosition,
} from '$lib/components/editable-grid/editable-grid.utils';
import { InteractionBase } from '$lib/modules/interaction-stack/interaction-base';
import type { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
import type { DataTypeOf } from '@grekomp/wonder-event-emitter';

export interface EditableGridLineDragInteractionData {
	grid: EditableGridController;
	line: EditableGridLine;
	axis: GridLineAxis;
}

export const editableGridLineDragInteractionType = 'EditableGridLineDragInteraction' as const;
const overlay: EditableGridOverlayData = {
	targetType: OverlayTargetType.Container,
	component: null,
};

export class EditableGridLineDragInteraction extends InteractionBase<
	EditableGridLineDragInteraction,
	typeof editableGridLineDragInteractionType,
	EditableGridLineDragInteractionData
> {
	constructor(stack: InteractionStack, data: EditableGridLineDragInteractionData) {
		super(stack, data, editableGridLineDragInteractionType);

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
	}

	_onStart() {
		this.data.grid.eventEmitter.on(gridEvents.container.mouseMove, this.onMouseMove);
		this.data.grid.addOverlay(overlay);
		document.addEventListener('mouseup', this.onMouseUp);
	}
	_onDispose() {
		this.data.grid.eventEmitter.off(gridEvents.container.mouseMove, this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
		this.data.grid.removeOverlay(overlay);
	}

	onMouseMove(eventData: DataTypeOf<typeof gridEvents.container.mouseMove>) {
		const { grid, line, axis } = this.data;
		const { gridContainer } = grid;

		if (!gridContainer) return;

		const relativePosition = calculateRelativePosition(
			eventData.clientX,
			eventData.clientY,
			gridContainer,
		);
		const requestedPosition = axis === GridLineAxis.Col ? relativePosition.x : relativePosition.y;

		const newPosition = getNewLinePosition({
			requestedPosition,
			line,
			axis,
			lines: grid.getLines(),
			cells: grid.getCells(),
			gridContainer,
		});

		grid.moveLine(line, newPosition);
	}
	onMouseUp() {
		this.complete();
	}
}

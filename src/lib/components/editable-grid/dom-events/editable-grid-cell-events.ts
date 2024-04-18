import type { EditableGridCellData } from '$lib/components/editable-grid/editable-grid.model';

export interface EditableGridCellMouseEventData {
	cell: EditableGridCellData;
	originalEvent: MouseEvent;
}

export enum EditableGridCellEvents {
	Click = 'EditableGridCellClickEvent',
	MouseEnter = 'EditableGridCellMouseEnterEvent',
	MouseMove = 'EditableGridCellMouseMoveEvent',
	MouseLeave = 'EditableGridCellMouseLeaveEvent',
}

export type EditableGridCellEventTypeDataMapping = {
	[EditableGridCellEvents.Click]: EditableGridCellMouseEventData;
	[EditableGridCellEvents.MouseEnter]: EditableGridCellMouseEventData;
	[EditableGridCellEvents.MouseMove]: EditableGridCellMouseEventData;
	[EditableGridCellEvents.MouseLeave]: EditableGridCellMouseEventData;
};

export function isGridCellEventOfType<T extends EditableGridCellEvents>(
	event: Event,
	eventType: T,
): event is CustomEvent<EditableGridCellEventTypeDataMapping[T]> {
	return event.type === eventType;
}

export function dispatchGridCellEvent<EventType extends EditableGridCellEvents>(
	eventType: EventType,
	data: EditableGridCellEventTypeDataMapping[EventType],
) {
	document.dispatchEvent(new CustomEvent(eventType, { detail: data }));
}

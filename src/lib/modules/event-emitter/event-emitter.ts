import type { EventDictionary, EventHandler } from '$lib/modules/event-emitter/event-emitter.model';

export class EventEmitter<EventDict extends EventDictionary, EventName extends keyof EventDict> {
	private callbacks: Partial<Record<EventName, EventHandler<EventDict, EventName>[]>> = {};

	on(name: EventName, callback: EventHandler<EventDict, EventName>) {
		this.callbacks[name] ??= [];
		if (this.callbacks[name]?.includes(callback)) return;

		this.callbacks[name]?.push(callback);
	}
	off(name: EventName, callback: EventHandler<EventDict, EventName>) {
		const callbacksForEvent = this.callbacks[name];
		if (!callbacksForEvent) return;

		const index = callbacksForEvent.indexOf(callback);
		if (index === -1) return;

		callbacksForEvent.splice(index, 1);
	}
	emit(name: EventName, data: EventDict[EventName]) {
		this.callbacks[name]?.forEach((callback) => callback(data));
	}
}

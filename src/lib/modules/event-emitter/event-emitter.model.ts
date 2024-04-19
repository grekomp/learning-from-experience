export type EventDictionary = Record<string, unknown>;
export type EventHandler<EventDict extends EventDictionary, EventName extends keyof EventDict> = (
	data: EventDict[EventName],
) => void;

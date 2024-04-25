import {
	eventIdKey,
	type CombinedEventDictionaryFor,
	type ModuleEventDescriptor,
	type ModuleEventDictionary,
	type ModuleEventDictionaryFor,
	type ModuleEventFactoryDictionary,
} from '$lib/modules/event-emitter/event-descriptors.model';

export function defineEvent<DataType extends object>() {
	const eventUuid = crypto.randomUUID();
	return (innerPath: string) =>
		({
			[eventIdKey]: `${innerPath}__${eventUuid}`,
			innerPath,
		}) as ModuleEventDescriptor<DataType>;
}

export function defineEventDictionary<Dict extends ModuleEventFactoryDictionary>(
	factoryDictionary: Dict,
	prefix: string = '',
): ModuleEventDictionaryFor<Dict> {
	return Object.fromEntries(
		Object.entries(factoryDictionary).map(([key, value]) => {
			if (typeof value === 'function') return [key, value(`${prefix}${key}`)];
			return [key, defineEventDictionary(value, `${prefix}${key}.`)];
		}),
	);
}

export function defineCombinedEventDictionary<Dict extends ModuleEventDictionary>(
	eventDictionary: Dict,
	prefix: string = '',
): CombinedEventDictionaryFor<Dict> {
	return Object.fromEntries(
		Object.entries(eventDictionary).map(([key, value]) => {
			if (eventIdKey in value) return [key, { ...value, path: `${prefix}${key}` }];
			return [key, defineCombinedEventDictionary(value, `${prefix}${key}.`)];
		}),
	);
}

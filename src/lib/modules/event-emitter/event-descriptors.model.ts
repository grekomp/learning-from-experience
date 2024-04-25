export const eventDataTypeKey = Symbol('dataType');
export const eventIdKey = Symbol('id');

export type DataTypeOf<T> = T extends ModuleEventDescriptor<infer DataType> ? DataType : never;

export interface EventDescriptor<DataType extends object> {
	[eventIdKey]: string;
	[eventDataTypeKey]: DataType;
}
export interface ModuleEventDescriptor<DataType extends object> extends EventDescriptor<DataType> {
	innerPath: string;
}
export interface CombinedEventDescriptor<DataType extends object>
	extends ModuleEventDescriptor<DataType> {
	path: string;
}

export type EventDictionary = {
	[key: string]: EventDescriptor<object> | EventDictionary;
};
export type ModuleEventDictionary = {
	[key: string]: ModuleEventDescriptor<object> | ModuleEventDictionary;
};
export type CombinedEventDictionary = {
	[key: string]: CombinedEventDescriptor<object> | CombinedEventDictionary;
};

export type ModuleEventFactory<DataType extends object> = (
	innerPath: string,
) => ModuleEventDescriptor<DataType>;
export type ModuleEventFactoryDictionary = {
	[key: string]: ModuleEventFactory<object> | ModuleEventFactoryDictionary;
};

export type ModuleEventDictionaryFor<FactoryDict extends ModuleEventFactoryDictionary> = {
	[Key in keyof FactoryDict]: FactoryDict[Key] extends ModuleEventFactoryDictionary
		? ModuleEventDictionaryFor<FactoryDict[Key]>
		: FactoryDict[Key] extends ModuleEventFactory<infer DataType>
			? ModuleEventDescriptor<DataType>
			: never;
};

export type CombinedEventDictionaryFor<Dict extends ModuleEventDictionary> = {
	[Key in keyof Dict]: Dict[Key] extends ModuleEventDescriptor<infer DataType>
		? CombinedEventDescriptor<DataType>
		: Dict[Key] extends ModuleEventDictionary
			? CombinedEventDictionaryFor<Dict[Key]>
			: never;
};

export type NestedEventDescriptors<Dict extends EventDictionary> = {
	[Key in keyof Dict]: Dict[Key] extends EventDictionary
		? NestedEventDescriptors<Dict[Key]>
		: Dict[Key];
}[keyof Dict];

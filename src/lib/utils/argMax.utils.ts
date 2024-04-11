export function argMax<T>(array: T[], transformer: (item: T) => number): number {
	const result = array.reduce(
		(acc, item, index) => {
			const value = transformer(item);
			return value > acc.value ? { value, index } : acc;
		},
		{ value: -Infinity, index: -1 },
	);

	return result.index;
}

export function argMaxValue<T>(array: T[], transformer: (item: T) => number): T | undefined {
	const index = argMax(array, transformer);
	if (index < 0) return undefined;

	return array[index];
}

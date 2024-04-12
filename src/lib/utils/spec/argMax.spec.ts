import { argMax } from '$lib/utils/argMax.utils';
import { noopMap } from '$lib/utils/noop.utils';
import { describe, expect, it } from 'vitest';

describe('argMax', () => {
	it('Should return -1 for an empty array', () => {
		expect(argMax([], (el) => el)).toBe(-1);
	});

	it.each([
		{ arr: [1, 3, 2, 5, 4], transform: noopMap, expected: 3 },
		{
			arr: [1, 3, 2, 5, 4],
			transform: (el: number) => el * -1,
			expected: 0,
		},
	])(
		'Should return the index of the value in the array for which `transformer` returns the highest value (%#)',
		({ arr, transform, expected }) => {
			expect(argMax(arr, transform)).toBe(expected);
		},
	);
});

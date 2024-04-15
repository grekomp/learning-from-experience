import { InteractionBase } from '$lib/modules/interaction-stack/interaction-base';
import { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
import { describe, expect, it, vi } from 'vitest';

describe('InteractionStack', () => {
	class TestInteraction extends InteractionBase<TestInteraction, 'TestInteraction'> {
		constructor(stack: InteractionStack, data: unknown) {
			super(stack, data, 'TestInteraction');
		}
		_onStart = vi.fn();
		_onComplete = vi.fn();
		_onCancel = vi.fn();
		_onStackPop = vi.fn();
	}

	it('Should allow starting interactions', () => {
		const stack = new InteractionStack();
		const interaction = new TestInteraction(stack, {});
		stack.put(interaction);

		expect(stack);
		expect(stack.top()).toBe(interaction);
		expect(stack.getByType('TestInteraction')).toBe(interaction);
	});

	it('Should call subscribers when interactions are started', () => {
		const stack = new InteractionStack();
		const interaction = new TestInteraction(stack, {});
		const subscriber = vi.fn();
		stack.subscribe(subscriber);
		stack.put(interaction);

		expect(subscriber).toHaveBeenCalledWith(stack);
	});

	it('Should call subscribers when interactions are updated', () => {
		const stack = new InteractionStack();
		const interaction = new TestInteraction(stack, {});

		const subscriber = vi.fn();
		stack.subscribe(subscriber);

		expect(subscriber).toHaveBeenCalledTimes(1);

		interaction.start();

		expect(subscriber).toHaveBeenCalledTimes(2);

		interaction.data = { test: 'data' };

		expect(subscriber).toHaveBeenCalledTimes(3);
		expect(subscriber).toHaveBeenLastCalledWith(stack);
	});

	it('Should allow removing interactions including children', () => {
		const stack = new InteractionStack();
		const interaction1 = new TestInteraction(stack, {});
		const interaction2 = new TestInteraction(stack, {});
		stack.put(interaction1);
		stack.put(interaction2);

		expect(stack.top()).toBe(interaction2);

		stack.remove(interaction1);

		expect(interaction1._onStackPop).toHaveBeenCalledOnce();
		expect(interaction2._onStackPop).toHaveBeenCalledOnce();
		expect(stack.top()).toBe(null);
	});

	it('Should allow removing interactions excluding children', () => {
		const stack = new InteractionStack();
		const interaction1 = new TestInteraction(stack, {});
		const interaction2 = new TestInteraction(stack, {});
		stack.put(interaction1);
		stack.put(interaction2);

		expect(stack.top()).toBe(interaction2);

		stack.remove(interaction1, { popChildren: false });

		expect(interaction1._onStackPop).toHaveBeenCalledOnce();
		expect(stack.top()).toBe(interaction2);
	});
});

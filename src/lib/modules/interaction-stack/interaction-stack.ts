import type { InteractionBase } from '$lib/modules/interaction-stack/interaction-base';
import { writable } from 'svelte/store';

export class InteractionStack<InteractionType extends string = string> {
	private __store = writable<InteractionStack<InteractionType>>(this);
	private __stack: InteractionBase[] = [];

	getAll(): readonly InteractionBase[] {
		return this.__stack;
	}

	subscribe = this.__store.subscribe;

	top() {
		return this.__stack.at(-1) ?? null;
	}
	isTop(interaction: InteractionBase) {
		return this.top() === interaction;
	}
	getIndexOf(interaction: InteractionBase) {
		return this.__stack.indexOf(interaction);
	}
	isInStack(interaction: InteractionBase) {
		return this.getIndexOf(interaction) >= 0;
	}
	assertIsInStack(interaction: InteractionBase) {
		if (this.isInStack(interaction) === false)
			throw new RangeError('Interaction not found in stack');
	}
	getByType<InteractionInstanceType = InteractionBase>(interactionType: InteractionType) {
		return this.__stack.findLast(
			(interaction) => interaction.interactionType === interactionType,
		) as InteractionInstanceType | undefined;
	}
	getChildrenOf(interaction: InteractionBase) {
		this.assertIsInStack(interaction);
		const index = this.getIndexOf(interaction);
		return this.__stack.slice(index + 1);
	}

	put(interaction: InteractionBase) {
		this.__stack.push(interaction);
		this.updateStore();
	}

	pop({ updateStore = true } = {}) {
		const interaction = this.__stack.pop();
		if (!interaction) return null;

		interaction._onStackPop();
		if (updateStore) this.updateStore();
		return interaction;
	}
	remove(interaction: InteractionBase, { popChildren = true } = {}) {
		this.assertIsInStack(interaction);

		if (popChildren) {
			while (this.isTop(interaction) === false) {
				this.pop({ updateStore: false });
			}

			return this.pop();
		}

		const index = this.getIndexOf(interaction);
		this.__stack.splice(index, 1);
		interaction._onStackPop();
		this.updateStore();
	}

	update(interaction: InteractionBase) {
		this.assertIsInStack(interaction);
		this.updateStore();
	}

	clear() {
		while (this.__stack.length > 0) {
			this.pop();
		}
	}

	private updateStore() {
		this.__store.set(this);
	}
}

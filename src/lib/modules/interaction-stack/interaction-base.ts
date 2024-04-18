import type { InteractionStack } from '$lib/modules/interaction-stack/interaction-stack';
import { InteractionStatus } from '$lib/modules/interaction-stack/interaction-stack.model';
import { writable } from 'svelte/store';

export abstract class InteractionBase<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ChildClassType = any,
	InteractionType extends string = string,
	DataType = unknown,
> {
	private __id: string;
	private __data: DataType;
	private __stack: InteractionStack<InteractionType>;
	private __status: InteractionStatus = InteractionStatus.Pending;
	private __store = writable<ChildClassType>(this as unknown as ChildClassType);

	get id(): string {
		return this.__id;
	}
	get data() {
		return this.__data;
	}
	set data(value: DataType) {
		this.__data = value;
		this.__stack.update(this);
		this.updateStore();
	}
	get status() {
		return this.__status;
	}
	get stack() {
		return this.__stack;
	}

	readonly interactionType: InteractionType;
	subscribe = this.__store.subscribe;

	constructor(stack: InteractionStack, initialData: DataType, interactionType: InteractionType) {
		this.__stack = stack;
		this.__data = initialData;
		this.__id = crypto.randomUUID();
		this.interactionType = interactionType;

		this._onStart = this._onStart.bind(this);
		this._onComplete = this._onComplete.bind(this);
		this._onCancel = this._onCancel.bind(this);
		this._onStackPop = this._onStackPop.bind(this);
		this._onDispose = this._onDispose.bind(this);
	}

	start(data?: DataType) {
		this.__data = data ?? this.__data;
		this.__status = InteractionStatus.InProgress;
		this.__stack.put(this);
		this._onStart();
		this.updateStore();
	}
	complete() {
		if (this.__status !== InteractionStatus.InProgress) return;

		this.__status = InteractionStatus.Completed;
		this._onComplete();
		this.__stack.remove(this);
		this.updateStore();
		this._onDispose();
	}
	cancel() {
		this.__status = InteractionStatus.Cancelled;
		this._onCancel();
		this.__stack.remove(this);
		this.updateStore();
		this._onDispose();
	}

	_onStart() {}
	_onComplete() {}
	_onCancel() {}
	_onStackPop() {}
	_onDispose() {}

	private updateStore() {
		this.__store.set(this as unknown as ChildClassType);
	}
}

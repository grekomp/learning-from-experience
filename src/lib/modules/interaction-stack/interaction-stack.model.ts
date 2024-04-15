export interface CompleteInteractionOptions {
	/**
	 * If true, all interactions above the passed interaction in the stack will be completed as well.
	 * The child interactions are completed starting from the top of the stack.
	 */
	completeAllChildren?: boolean;
	/**
	 * Passes force to the interaction's complete method.
	 * If true, the interaction will not be allowed to defer completion,
	 * and will be removed from the stack immediately.
	 */
	force?: boolean;
}

export enum InteractionStatus {
	Pending = 'Pending',
	InProgress = 'InProgress',
	Completed = 'Completed',
	Cancelled = 'Cancelled',
}

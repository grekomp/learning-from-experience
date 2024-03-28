<script lang="ts">
	let width = '0px';
	let height = '0px';
	let top = '50vh';
	let left = '50vw';
	let transitionBounds = false;
	let transitionVisibility = true;
	let enabled = false;
	let visible = false;

	/**
	 * Scrolling with the mouse wheel or arrow keys should hide the overlay.
	 * The exception is when the scroll was caused by switching focus
	 * to an off-screen element.
	 */
	let isChangingFocus = false;

	const enable = () => {
		enabled = true;
		transitionVisibility = true;
	};

	const disable = (immediate?: boolean) => {
		enabled = false;
		visible = false;
		transitionBounds = false;
		transitionVisibility = !immediate;
	};

	const handleFocus = (event: Event) => {
		isChangingFocus = true;

		// We don't need to detect keypresses manually, instead we rely on
		// the browser's built-in `:focus-visible` pseudo-class
		if (document.querySelector(':focus-visible')) enable();

		const target = event.target;
		const body = document.body;

		// Focus moving to body is equivalent to not having anything focused
		if (target === body) return disable();

		if (target instanceof HTMLElement) {
			const rect = target.getBoundingClientRect();

			const docEl = document.documentElement;

			const scrollTop = window.scrollY || docEl.scrollTop || body.scrollTop;
			const scrollLeft = window.scrollX || docEl.scrollLeft || body.scrollLeft;

			const clientTop = docEl.clientTop || body.clientTop || 0;
			const clientLeft = docEl.clientLeft || body.clientLeft || 0;

			width = `${rect.width}px`;
			height = `${rect.height}px`;
			top = `${rect.top + scrollTop - clientTop}px`;
			left = `${rect.left + scrollLeft - clientLeft}px`;

			// Delay enabling the transition so that the initial render is not animated
			requestAnimationFrame(() => {
				transitionBounds = true;
				visible = true;
				isChangingFocus = false;
			});
		}
	};

	const handleBlur = (event: FocusEvent) => {
		// If `event.relatedTarget` is null, it means the focus is not moving to another element
		if (!event.relatedTarget) disable();
	};

	const handleMousedown = () => disable(true);

	const handleScroll = () => {
		if (isChangingFocus) return;
		disable(true);
	};
</script>

<svelte:document
	on:focus|capture={handleFocus}
	on:blur|capture={handleBlur}
	on:mousedown|capture={handleMousedown}
	on:scroll={handleScroll}
/>

<div
	style:width
	style:height
	style:top
	style:left
	style:--bounds-transition-duration={transitionBounds ? undefined : '0s'}
	style:--visibility-transition-duration={transitionVisibility ? undefined : '0s'}
	id="floating-focus-indicator"
	class:visible={visible && enabled}
/>

<style>
	#floating-focus-indicator {
		/* We don't want the overlay to be clickable */
		pointer-events: none;

		/* These styles will control the look of the outline */
		outline: solid 3px deeppink;
		outline-offset: 2px;
		border-radius: 5px;

		/* We want the overlay to be positioned above all other content */
		position: absolute;
		z-index: 9999999;

		/* By default, the overlay should be invisible */
		opacity: 0;
		transform: scale(1.5);

		--visibility-transition-duration: 0.3s;
		--bounds-transition-duration: 0.3s;

		transition:
			opacity var(--visibility-transition-duration),
			transform var(--visibility-transition-duration),
			width var(--bounds-transition-duration),
			height var(--bounds-transition-duration),
			top var(--bounds-transition-duration),
			bottom var(--bounds-transition-duration),
			left var(--bounds-transition-duration),
			right var(--bounds-transition-duration);
	}

	#floating-focus-indicator.visible {
		opacity: 1;
		transform: scale(1);
	}
</style>

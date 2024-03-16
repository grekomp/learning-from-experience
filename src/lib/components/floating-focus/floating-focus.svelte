<script lang="ts">
	let width = '0px';
	let height = '0px';
	let top = '50vh';
	let left = '50vw';
	let transitionBounds = false;
	let transitionVisibility = true;
	let enabled = false;
	let visible = false;

	// Used to detect when changing focus causes the scroll position to change
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

		// We don't need to detect keypresses manually, instead we rely on the browser's built-in `:focus-visible` pseudo-class
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

	const handleScroll = (event: Event) => {
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
	class="pointer-events-none absolute rounded outline outline-offset-2 outline-pink-600"
	class:opacity-0={!visible || !enabled}
	class:scale-150={!visible || !enabled}
/>

<style>
	#floating-focus-indicator {
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
</style>

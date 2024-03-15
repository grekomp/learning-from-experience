<script lang="ts">
	let width = '100vw';
	let height = '100vh';
	let top = '-2px';
	let left = '-2px';
	let transition = false;
	let enabled = false;

	const disable = () => {
		enabled = false;
		transition = false;
	};

	const handleFocus = (event: Event) => {
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
				transition = true;
			});
		}
	};

	const handleBlur = (event: FocusEvent) => {
		// If `event.relatedTarget` is null, it means the focus is not moving to another element
		if (!event.relatedTarget) disable();
	};

	const handleKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Tab':
				break;
			case 'ArrowUp':
			case 'ArrowDown':
			case 'ArrowLeft':
			case 'ArrowRight':
				// Arrow keys should only display the focus overlay if they caused an element to be focused - eg. in tabs component
				if (!document.querySelector(':focus-visible')) return;
				break;
			default:
				return;
		}

		enabled = true;
	};

	const handleMousedown = disable;
</script>

<svelte:document
	on:focus|capture={handleFocus}
	on:blur|capture={handleBlur}
	on:keydown|capture={handleKeydown}
	on:mousedown|capture={handleMousedown}
/>

<div
	style:display={enabled ? 'block' : 'none'}
	style:width
	style:height
	style:top
	style:left
	style:transition-duration={transition ? undefined : '0s'}
	id="floating-focus-indicator"
	class="pointer-events-none absolute rounded outline outline-offset-2 outline-pink-600 transition-all duration-300"
></div>

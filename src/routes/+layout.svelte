<script>
	import FloatingFocus from '$lib/components/floating-focus/floating-focus.svelte';
	import '../app.css';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<Footer />
</div>

<FloatingFocus />

<style>
	:global(body) {
		overflow: hidden auto;
	}
</style>

<script>
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="app">
	<Header></Header>

	<main>
		<slot />
	</main>

	<footer>
		<p>© Grzegorz Palian</p>
	</footer>
</div>

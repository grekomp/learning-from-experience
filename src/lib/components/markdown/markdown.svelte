<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';

	export let source: string | null | undefined;
</script>

<div class="markdown flex flex-col items-center">
	<SvelteMarkdown {source} />
</div>

<style lang="postcss">
	:global(.markdown > *) {
		@apply w-full max-w-2xl;
	}

	:global(.markdown h1) {
		@apply scroll-m-20 text-4xl font-extrabold tracking-tight text-emphasized-foreground lg:text-5xl [&:not(:first-child)]:mt-10;
	}

	:global(.markdown h2) {
		@apply scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-emphasized-foreground transition-colors [&:not(:first-child)]:mt-10;
	}

	:global(.markdown h3) {
		@apply scroll-m-20 text-2xl font-semibold tracking-tight text-emphasized-foreground [&:not(:first-child)]:mt-10;
	}

	:global(.markdown h4) {
		@apply scroll-m-20 text-xl font-semibold tracking-tight text-emphasized-foreground [&:not(:first-child)]:mt-10;
	}

	:global(.markdown h5) {
		@apply scroll-m-20 text-lg font-semibold tracking-tight text-emphasized-foreground [&:not(:first-child)]:mt-10;
	}

	:global(.markdown h6) {
		@apply scroll-m-20 text-base font-semibold tracking-tight text-emphasized-foreground [&:not(:first-child)]:mt-10;
	}

	:global(.markdown p) {
		@apply leading-7 [&:not(:first-child)]:mt-6;
	}

	:global(.markdown ul) {
		@apply ml-6 mt-6 list-disc;
	}

	:global(.markdown ol) {
		@apply ml-6 mt-6 list-decimal;
	}

	:global(.markdown ul > li),
	:global(.markdown ol > li) {
		@apply mt-2;
	}

	:global(.markdown blockquote) {
		@apply mt-6 border-l-2 pl-6 italic;
	}

	:global(.markdown code) {
		@apply relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold;
	}

	:global(.markdown a) {
		@apply text-accent-foreground underline decoration-blue-900 decoration-2 underline-offset-8  hover:decoration-4;
	}
</style>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<style>
  .layout {
  display: grid;
  grid-template-rows: var(--header-height) 1fr var(--footer-height);
  height: 100vh;
}
</style>

<div class="layout">
  <Header />
  {@render children()}
  <Footer />
</div>

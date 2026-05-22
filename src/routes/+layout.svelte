<script lang="ts">
  import { APP_TITLE, APP_DESCRIPTION } from '$lib/Config';
  import { replaceState } from '$app/navigation';
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  import { appState } from '$lib/data/State.svelte';

  async function loadYears(): Promise<Record<string, object>> {
    const res = await fetch('years.json');
    if (!res.ok) throw new Error('Failed to load years.json');
    const data = await res.json();
    return data;
  }

  function getAvailableYear(year: string | null): string | null {
    return year && appState.years.includes(year) ? year : null;
  }

  function applyRouteYears() {
    const baseYear = getAvailableYear(page.url.searchParams.get('year')) ?? appState.years[0];
    const compareYear = getAvailableYear(page.url.searchParams.get('compare'));

    appState.baseYear = baseYear;
    appState.compareYear = compareYear === baseYear ? null : compareYear;
  }

  function getYearRoute(): URL | null {
    if (!appState.baseYear) return null;

    const url = new URL(page.url);
    url.searchParams.set('year', appState.baseYear);

    if (appState.compareYear && appState.compareYear !== appState.baseYear) {
      url.searchParams.set('compare', appState.compareYear);
    } else {
      url.searchParams.delete('compare');
    }

    return url;
  }

  onMount(async () => {
    try {
      const data = await loadYears();
      const availableYears = Object.keys(data).sort().reverse();

      appState.years.push(...availableYears);
      applyRouteYears();
    } catch (err) {
      console.error('Failed to load years.json', err);
    }
  });

  $effect(() => {
    if (appState.baseYear === appState.compareYear) appState.compareYear = null;
  });

  $effect(() => {
    const url = getYearRoute();
    if (!url || url.href === page.url.href) return;

    const route = resolve(`/?${url.searchParams.toString()}${url.hash}`);
    replaceState(route, page.state);
  });
  let { children } = $props();
</script>

<svelte:head>
  <title>{APP_TITLE}</title>
  <meta name="description" content={APP_DESCRIPTION} />
</svelte:head>

<main class="layout">
  <Header />
  {@render children()}
  <Footer />
</main>

<style>
  .layout {
    display: grid;
    grid-template-rows: var(--header-height) 1fr var(--footer-height);
    height: 100vh;
  }
</style>

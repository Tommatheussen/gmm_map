<script lang="ts">
  import { APP_DESCRIPTION, APP_TITLE_FULL } from '$lib/Config';
  import { appState } from '$lib/data/State.svelte';

  const viewText = $derived.by(() => {
    const { baseYear, compareYear } = appState;

    if (compareYear) return `Comparing: ${compareYear} (left) ↔ ${baseYear} (right)`;
    if (baseYear) return `Viewing: ${baseYear}`;
  });
</script>

<header class="header">
  <h2 class="header-left">
    <strong>{APP_TITLE_FULL}</strong>
  </h2>

  <div class="header-center">
    <h4>{viewText}</h4>
  </div>

  <div class="header-right">
    <small>{APP_DESCRIPTION}</small>
  </div>
</header>

<style>
  header {
    height: var(--header-height);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    padding: 0 1rem;
    background: var(--secondary-bg-color);
    color: #eee;
    font-size: 0.95rem;
  }

  .header-left {
    font-weight: 600;
    white-space: nowrap;
  }

  .header-center {
    text-align: center;
    color: #ddd;
  }

  .header-right {
    white-space: nowrap;
    color: #aaa;
    font-size: 0.85rem;
    text-align: right;
  }
</style>

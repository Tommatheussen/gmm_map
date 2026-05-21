<script lang="ts">
  import {
    appState,
    categoryVisibilityState,
    categoryHighlightState
  } from '$lib/data/State.svelte';
  import Select from '$lib/components/Select.svelte';
  import { layerCache } from '$lib/data/LayerCache';
  import CategoryList from './CategoryList.svelte';

  for (const fixedId of Object.keys(categoryVisibilityState).map(Number)) {
    $effect(() => {
      const visible = categoryVisibilityState[fixedId];
      for (const layer of layerCache.cachedEntries) {
        layer.handleCategoryVisibility(fixedId, visible);
      }
    });
  }

  $effect(() => {
    const highlighted = categoryHighlightState.highlight;

    for (const layer of layerCache.cachedEntries) {
      layer.handleCategoryBorderChange(highlighted);
    }
  });
</script>

<aside class="sidebar">
  <fieldset>
    <legend>🗓 Year</legend>
    <Select bind:value={appState.baseYear} placeholder="Select base year" />
    <p class="info-text">Select the year you want to view on the map.</p>
  </fieldset>

  <fieldset>
    <legend>🔀 Compare</legend>
    <Select bind:value={appState.compareYear} placeholder="Select comparison year" clearOption />
    <p class="info-text">
      Optionally select another year to compare with the base year. If no year is selected, only the
      base year will be visible.
    </p>
  </fieldset>

  <fieldset class="category-toggle">
    <legend>👁️ Categories</legend>
    <CategoryList />
  </fieldset>

  <div></div>
</aside>

<style>
  .sidebar {
    max-height: calc(100vh - var(--header-height) - var(--footer-height));
    padding: 1rem;
    border-right: var(--border);
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    gap: 1rem;
    box-sizing: border-box;
  }

  fieldset {
    min-height: auto;
    border: var(--border);
    padding: 0.75rem;
    border-radius: var(--border-radius);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  legend {
    font-size: var(--title-size);
    padding: 0 0.5rem;
    color: var(--title-color);
  }

  .info-text {
    font-size: var(--info-size);
    color: var(--info-color);
    margin-top: 0.5rem;
    font-style: italic;
  }

  .category-toggle {
    overflow-y: hidden;
  }
</style>

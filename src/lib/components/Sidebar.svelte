<script lang="ts">
  import { appState, categoryVisibilityState } from '$lib/data/State.svelte';
  import Select from '$lib/components/Select.svelte';
  import { layerCache } from '$lib/LayerCache';
  import CategoryList from './CategoryList.svelte';

  for (const fixedId of Object.keys(categoryVisibilityState)) {
    $effect(() => {
      const visible = categoryVisibilityState[fixedId];
      for (const layer of layerCache.cachedEntries) {
        layer.handleCategoryVisibility(fixedId, visible);
      }
    });
  }
</script>

<aside class="sidebar">
  <section class="sidebar-description">
    <strong>Explore Graspop Metal Meeting maps across the years!</strong>
    <ul>
      <li>Pick a year to view stages, food, toilets, and more</li>
      <li>Optionally pick a second year to compare changes</li>
      <li>Click on map areas for detailse</li>
      <li>Show/hide categories</li>
    </ul>
    <hr />
  </section>

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
    background-color: var(--bg-color);
    border-right: 1px solid #ddd;
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    gap: 1rem;
    font-family: sans-serif;
    box-sizing: border-box;
  }

  fieldset {
    min-height: auto;
    border: 1px solid #ccc;
    padding: 0.75rem;
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  legend {
    font-weight: 600;
    font-size: 1.35rem;
    padding: 0 0.5rem;
    color: #333;
  }

  .info-text {
    font-size: 0.85rem;
    color: #666;
    margin-top: 0.5rem;
    font-style: italic;
  }

  .category-toggle {
    overflow-y: hidden;
  }

  .sidebar-description {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #222;
  }

  .sidebar-description ul {
    padding-left: 1rem;
    margin: 0.5rem 0 0 0;
    list-style: none; /* remove default bullets */
  }

  .sidebar-description li {
    margin-bottom: 0.25rem;
  }

  .sidebar-description li::before {
    content: '🤘';
    margin-right: 0.5rem;
    display: inline-block;
  }
</style>

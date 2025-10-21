<script lang="ts">
  import { appState, categoryVisibilityState } from '$lib/data/State.svelte';
  import Select from '$lib/components/Select.svelte';
  import { layerCache } from '$lib/LayerCache';
  import { CATEGORY_LIST } from '$lib/data/Categories';

  for (const fixedId of Object.keys(categoryVisibilityState)) {
    $effect(() => {
      const visible = categoryVisibilityState[fixedId]; // reactive read
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

  <fieldset>
    <legend>🔀 Categories</legend>
    {#each CATEGORY_LIST as category (category.id)}
      <label>
        <input type="checkbox" bind:checked={categoryVisibilityState[category.fixed_id]} />
        {category.name}
      </label>
    {/each}
    <Select bind:value={appState.compareYear} placeholder="Select comparison year" clearOption />
    <p class="info-text">
      Optionally select another year to compare with the base year. If no year is selected, only the
      base year will be visible.
    </p>
  </fieldset>
</aside>

<style>
  .sidebar {
    padding: 1rem;
    background-color: var(--bg-color);
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: sans-serif;
    box-sizing: border-box;
  }

  fieldset {
    border: 1px solid #ddd;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 6px;
  }

  legend {
    font-weight: bold;
    font-size: x-large;
  }

  .info-text {
    font-size: 0.85rem;
    color: #555;
    margin-top: 0.3rem;
    font-style: italic;
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

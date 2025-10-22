<script lang="ts">
  import { CATEGORY_LIST } from '$lib/data/Categories';
  import CategoryItem from '$lib/components/CategoryItem.svelte';

  let searchQuery = $state('');
  let filteredCategories = $derived(
    CATEGORY_LIST.filter((cat) => cat.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  );
</script>

<div class="category-list-container">
  <input
    class="category-search"
    type="text"
    placeholder="Search categories..."
    bind:value={searchQuery}
    autocomplete="off"
  />

  <div class="category-list">
    {#each filteredCategories as category (category.id)}
      <CategoryItem {category} />
    {/each}

    {#if filteredCategories.length === 0}
      <p class="category-empty">No categories found.</p>
    {/if}
  </div>
</div>

<style>
  .category-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 100%;
    gap: 0.4rem;
    padding: 0.1rem;
  }

  .category-list-container {
    display: grid;
    max-height: 100%;
    grid-template-rows: auto 1fr;
    padding-bottom: 0.5rem;
  }

  .category-search {
    position: relative;
    background: var(--input-bg-color);
    color: var(--label-color);
    border: var(--border);
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    margin-bottom: 0.5rem;
  }

  .category-search:hover {
    border-color: #aaa;
  }
</style>

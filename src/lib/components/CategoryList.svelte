<script lang="ts">
  import { CATEGORY_GROUP_LIST, CATEGORY_LIST } from '$lib/data/Categories';
  import CategoryGroupItem from '$lib/components/CategoryGroupItem.svelte';
  import type { Category, CategoryGroup } from '$lib/interfaces/Category';

  type VisibleCategoryGroup = CategoryGroup & { categories: Category[] };

  function matchesSearch(values: readonly string[], query: string): boolean {
    return values.some((value) => value.toLowerCase().includes(query));
  }

  function groupCategories(group: CategoryGroup): Category[] {
    return CATEGORY_LIST.filter((category) => category.group_id === group.category_group_id);
  }

  function filterGroups(query: string): VisibleCategoryGroup[] {
    return CATEGORY_GROUP_LIST.map((group) => {
      const categories = groupCategories(group);
      const groupMatches = matchesSearch([group.name], query);

      if (!query || groupMatches) {
        return { ...group, categories };
      }

      return {
        ...group,
        categories: categories.filter((category) =>
          matchesSearch([category.name, ...(category.aliases ?? [])], query)
        )
      };
    }).filter((group) => group.categories.length > 0);
  }

  let searchQuery = $state('');
  let normalizedSearchQuery = $derived(searchQuery.trim().toLowerCase());
  let filteredCategoryGroups = $derived(filterGroups(normalizedSearchQuery));
  let hasFilteredCategories = $derived(filteredCategoryGroups.length > 0);
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
    {#each filteredCategoryGroups as group (group.category_group_id)}
      <CategoryGroupItem
        {group}
        categories={group.categories}
        forceExpanded={normalizedSearchQuery.length > 0}
      />
    {/each}

    {#if !hasFilteredCategories}
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

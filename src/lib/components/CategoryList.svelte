<script lang="ts">
  import { CATEGORY_GROUP_LIST, CATEGORY_LIST } from '$lib/data/Categories';
  import CategoryItem from '$lib/components/CategoryItem.svelte';
  import CategoryGroupItem from '$lib/components/CategoryGroupItem.svelte';
  import type { Category, CategoryGroup } from '$lib/interfaces/Category';

  type VisibleCategoryGroup = CategoryGroup & { categories: Category[] };

  const groupedCategoryIds = new Set(
    CATEGORY_GROUP_LIST.flatMap((group) => [...group.category_ids])
  );

  function matchesSearch(values: readonly string[], query: string): boolean {
    return values.some((value) => value.toLowerCase().includes(query));
  }

  function groupCategories(group: CategoryGroup): Category[] {
    return group.category_ids
      .map((categoryId) => CATEGORY_LIST.find((category) => category.category_id === categoryId))
      .filter((category): category is Category => category !== undefined);
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

  function filterFlatCategories(query: string): Category[] {
    return CATEGORY_LIST.filter((category) => {
      if (groupedCategoryIds.has(category.category_id)) return false;
      if (!query) return true;

      return matchesSearch([category.name, ...(category.aliases ?? [])], query);
    });
  }

  let searchQuery = $state('');
  let normalizedSearchQuery = $derived(searchQuery.trim().toLowerCase());
  let filteredCategoryGroups = $derived(filterGroups(normalizedSearchQuery));
  let filteredCategories = $derived(filterFlatCategories(normalizedSearchQuery));
  let hasFilteredCategories = $derived(
    filteredCategoryGroups.length > 0 || filteredCategories.length > 0
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
    {#each filteredCategoryGroups as group (group.category_group_id)}
      <CategoryGroupItem
        {group}
        categories={group.categories}
        forceExpanded={normalizedSearchQuery.length > 0}
      />
    {/each}

    {#each filteredCategories as category (category.category_id)}
      <CategoryItem {category} />
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

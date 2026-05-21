<script lang="ts">
  import { CATEGORY_GROUP_LIST, CATEGORY_LIST } from '$lib/data/Categories';
  import CategoryItem from '$lib/components/CategoryItem.svelte';
  import { categoryVisibilityState } from '$lib/data/State.svelte';
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
      const groupMatches = matchesSearch([group.name, ...(group.aliases ?? [])], query);

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

  function isCategoryVisible(category: Category): boolean {
    return categoryVisibilityState[category.category_id] !== false;
  }

  function isGroupChecked(group: VisibleCategoryGroup): boolean {
    return group.categories.length > 0 && group.categories.every(isCategoryVisible);
  }

  function isGroupMixed(group: VisibleCategoryGroup): boolean {
    const visibleCount = group.categories.filter(isCategoryVisible).length;
    return visibleCount > 0 && visibleCount < group.categories.length;
  }

  function toggleGroup(group: VisibleCategoryGroup): void {
    const visible = !isGroupChecked(group);

    for (const category of group.categories) {
      categoryVisibilityState[category.category_id] = visible;
    }
  }

  function indeterminate(node: HTMLInputElement, value: boolean) {
    node.indeterminate = value;

    return {
      update(nextValue: boolean) {
        node.indeterminate = nextValue;
      }
    };
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
      <section class="category-group" aria-labelledby={`category-group-${group.category_group_id}`}>
        <label id={`category-group-${group.category_group_id}`} class="category-group-header">
          <input
            type="checkbox"
            checked={isGroupChecked(group)}
            use:indeterminate={isGroupMixed(group)}
            onchange={() => toggleGroup(group)}
            autocomplete="off"
          />
          <span class="category-group-name">{group.name}</span>
        </label>

        <div class="category-group-items">
          {#each group.categories as category (category.category_id)}
            <CategoryItem {category} />
          {/each}
        </div>
      </section>
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

  .category-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .category-group-header {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.6rem;
    color: var(--title-color);
    font-size: var(--label-size);
    font-weight: 600;
    cursor: pointer;
  }

  .category-group-header input[type='checkbox'] {
    accent-color: #4a8ef0;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    margin: 0;
  }

  .category-group-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category-group-items {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding-left: 0.85rem;
  }
</style>

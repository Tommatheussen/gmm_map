<script lang="ts">
  import { CATEGORY_GROUP_LIST, CATEGORY_LIST } from '$lib/data/Categories';
  import CategoryGroupItem from '$lib/components/CategoryGroupItem.svelte';
  import type { Category, CategoryGroup, CategoryGroupTree } from '$lib/interfaces/Category';

  function matchesSearch(values: readonly string[], query: string): boolean {
    return values.some((value) => value.toLowerCase().includes(query));
  }

  function matchesCategory(category: Category, query: string): boolean {
    return matchesSearch([category.name, ...(category.aliases ?? [])], query);
  }

  function groupCategories(group: CategoryGroup): Category[] {
    return CATEGORY_LIST.filter((category) => category.group_id === group.category_group_id);
  }

  function hasCategories(group: CategoryGroupTree): boolean {
    return group.categories.length > 0 || group.groups.some(hasCategories);
  }

  function buildGroup(group: CategoryGroup): CategoryGroupTree {
    return {
      ...group,
      categories: groupCategories(group),
      groups: CATEGORY_GROUP_LIST.filter(
        (childGroup) => childGroup.parent_group_id === group.category_group_id
      )
        .map(buildGroup)
        .filter(hasCategories)
    };
  }

  function filterGroup(group: CategoryGroupTree, query: string): CategoryGroupTree | undefined {
    if (matchesSearch([group.name], query)) return group;

    const filteredGroup = {
      ...group,
      categories: group.categories.filter((category) => matchesCategory(category, query)),
      groups: group.groups
        .map((childGroup) => filterGroup(childGroup, query))
        .filter((childGroup): childGroup is CategoryGroupTree => childGroup !== undefined)
    };

    return hasCategories(filteredGroup) ? filteredGroup : undefined;
  }

  function rootGroups(): CategoryGroupTree[] {
    return CATEGORY_GROUP_LIST.filter((group) => !group.parent_group_id)
      .map(buildGroup)
      .filter(hasCategories);
  }

  function filterGroups(query: string): CategoryGroupTree[] {
    const groups = rootGroups();
    if (!query) return groups;

    return groups
      .map((group) => filterGroup(group, query))
      .filter((group): group is CategoryGroupTree => group !== undefined);
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
      <CategoryGroupItem {group} forceExpanded={normalizedSearchQuery.length > 0} />
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

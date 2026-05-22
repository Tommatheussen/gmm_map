<script lang="ts">
  import CategoryItem from '$lib/components/CategoryItem.svelte';
  import CategoryGroupItem from './CategoryGroupItem.svelte';
  import { categoryVisibilityState } from '$lib/data/State.svelte';
  import type { Category, CategoryGroupTree } from '$lib/interfaces/Category';

  let { group, forceExpanded = false }: { group: CategoryGroupTree; forceExpanded?: boolean } =
    $props();

  let expanded = $state(false);
  let isExpanded = $derived(forceExpanded || expanded);
  let visibleCategories = $derived(allCategories(group));

  function allCategories(categoryGroup: CategoryGroupTree): Category[] {
    return [
      ...categoryGroup.categories,
      ...categoryGroup.groups.flatMap((childGroup) => allCategories(childGroup))
    ];
  }

  function onlyCategory(categoryGroup: CategoryGroupTree): Category | undefined {
    const categories = allCategories(categoryGroup);

    return categories.length === 1 ? categories[0] : undefined;
  }

  let childGroups = $derived(group.groups.filter((childGroup) => !onlyCategory(childGroup)));
  let childCategories = $derived(
    group.groups.flatMap((childGroup) => {
      const category = onlyCategory(childGroup);

      return category ? [category] : [];
    })
  );

  function isCategoryVisible(category: Category): boolean {
    return categoryVisibilityState[category.fixed_id] !== false;
  }

  function isGroupChecked(): boolean {
    return visibleCategories.length > 0 && visibleCategories.every(isCategoryVisible);
  }

  function isGroupMixed(): boolean {
    const visibleCount = visibleCategories.filter(isCategoryVisible).length;
    return visibleCount > 0 && visibleCount < visibleCategories.length;
  }

  function toggleExpanded(): void {
    expanded = !expanded;
  }

  function toggleGroup(): void {
    const visible = !isGroupChecked();

    for (const category of visibleCategories) {
      categoryVisibilityState[category.fixed_id] = visible;
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
</script>

<section class="category-group" aria-labelledby={`category-group-${group.category_group_id}`}>
  <div
    class:category-group-active={isGroupChecked() || isGroupMixed()}
    class="category-group-header"
  >
    <label id={`category-group-${group.category_group_id}`} class="category-group-toggle">
      <input
        type="checkbox"
        checked={isGroupChecked()}
        use:indeterminate={isGroupMixed()}
        onchange={toggleGroup}
        autocomplete="off"
      />
      <span class="category-group-name">{group.name}</span>
    </label>

    <button
      class="category-group-expander"
      type="button"
      aria-label={isExpanded ? `Collapse ${group.name}` : `Expand ${group.name}`}
      aria-expanded={isExpanded}
      aria-controls={`category-group-items-${group.category_group_id}`}
      onclick={toggleExpanded}
    >
      <span class:expanded={isExpanded}></span>
    </button>
  </div>

  {#if isExpanded}
    <div id={`category-group-items-${group.category_group_id}`} class="category-group-items">
      {#each childGroups as childGroup (childGroup.category_group_id)}
        <CategoryGroupItem group={childGroup} {forceExpanded} />
      {/each}
      {#each group.categories as category (category.fixed_id)}
        <CategoryItem {category} />
      {/each}
      {#each childCategories as category (category.fixed_id)}
        <CategoryItem {category} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .category-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .category-group-header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--label-size);
    color: var(--label-color);
    background: var(--input-bg-color);
    padding: 0.4rem 0.6rem;
    border-radius: var(--border-radius);
    transition:
      background 0.15s ease,
      box-shadow 0.15s ease;
  }

  .category-group-header:hover {
    background: #f1f1f1;
  }

  .category-group-header.category-group-active {
    background: #e8f0ff;
    box-shadow: 0 0 0 1px #4a8ef0;
  }

  .category-group-expander {
    width: 1rem;
    height: 1rem;
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
    color: var(--label-color);
    cursor: pointer;
    padding: 0;
  }

  .category-group-expander span {
    width: 0;
    height: 0;
    border-top: 0.25rem solid transparent;
    border-bottom: 0.25rem solid transparent;
    border-left: 0.38rem solid currentColor;
    transition: transform 0.15s ease;
  }

  .category-group-expander span.expanded {
    transform: rotate(90deg);
  }

  .category-group-toggle {
    min-width: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 600;
  }

  .category-group-toggle input[type='checkbox'] {
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

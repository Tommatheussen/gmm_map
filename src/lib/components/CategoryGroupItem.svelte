<script lang="ts">
  import CategoryItem from '$lib/components/CategoryItem.svelte';
  import { categoryVisibilityState } from '$lib/data/State.svelte';
  import type { Category, CategoryGroup } from '$lib/interfaces/Category';

  let {
    group,
    categories,
    forceExpanded = false
  }: { group: CategoryGroup; categories: Category[]; forceExpanded?: boolean } = $props();

  let expanded = $state(true);
  let isExpanded = $derived(forceExpanded || expanded);

  function isCategoryVisible(category: Category): boolean {
    return categoryVisibilityState[category.category_id] !== false;
  }

  function isGroupChecked(): boolean {
    return categories.length > 0 && categories.every(isCategoryVisible);
  }

  function isGroupMixed(): boolean {
    const visibleCount = categories.filter(isCategoryVisible).length;
    return visibleCount > 0 && visibleCount < categories.length;
  }

  function toggleExpanded(): void {
    expanded = !expanded;
  }

  function toggleGroup(): void {
    const visible = !isGroupChecked();

    for (const category of categories) {
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
      {#each categories as category (category.category_id)}
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

<script lang="ts">
  import CategoryItem from '$lib/components/CategoryItem.svelte';
  import { categoryVisibilityState } from '$lib/data/State.svelte';
  import type { Category, CategoryGroup } from '$lib/interfaces/Category';

  let { group, categories }: { group: CategoryGroup; categories: Category[] } = $props();

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
  <label id={`category-group-${group.category_group_id}`} class="category-group-header">
    <input
      type="checkbox"
      checked={isGroupChecked()}
      use:indeterminate={isGroupMixed()}
      onchange={toggleGroup}
      autocomplete="off"
    />
    <span class="category-group-name">{group.name}</span>
  </label>

  <div class="category-group-items">
    {#each categories as category (category.category_id)}
      <CategoryItem {category} />
    {/each}
  </div>
</section>

<style>
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

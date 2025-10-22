<script lang="ts">
  import { categoryVisibilityState } from '$lib/data/State.svelte';

  let { category } = $props();
</script>

<label class="category-item">
  <input
    type="checkbox"
    bind:checked={categoryVisibilityState[category.fixed_id]}
    autocomplete="off"
  />
  <span class="category-color" style:background={category.color}></span>
  <span class="category-name">{category.name}</span>
</label>

<style>
  .category-item {
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--label-size);
    color: var(--label-color);
    background: var(--input-bg-color);
    padding: 0.4rem 0.6rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition:
      background 0.15s ease,
      box-shadow 0.15s ease;
  }

  .category-item:hover {
    background: #f1f1f1;
  }

  .category-item input[type='checkbox'] {
    accent-color: #4a8ef0; /* modern browsers */
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    margin: 0;
  }

  .category-color {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .category-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category-item:has(input:checked) {
    background: #e8f0ff;
    box-shadow: 0 0 0 1px #4a8ef0;
  }
</style>

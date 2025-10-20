<script lang="ts">
  import { appState } from '$lib/data/State.svelte';
  import { onMount } from 'svelte';

  let { value, clearOption = false, placeholder } = $props();
  let options = appState.years;

  let open = $state(false);
  let selectEl: HTMLDivElement;

  function toggle() {
    open = !open;
  }

  function selectOption(option: string | null = null) {
    value = option;
  }

  function handleClickOutside(event: MouseEvent) {
    if (!selectEl.contains(event.target as Node)) {
      open = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="select" bind:this={selectEl} onclick={toggle}>
  <span class="selected">
    {#if value != null}
      {value}
    {:else}
      <span class="placeholder">{placeholder}</span>
    {/if}
  </span>
  <svg class="arrow" width="10" height="6" viewBox="0 0 10 6">
    <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" />
  </svg>

  {#if open}
    <ul class="dropdown">
      {#if clearOption}
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li class:selected={!value} onclick={() => selectOption()}>Don't compare</li>
      {/if}
      {#each options as option, index (index)}
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li class:selected={option === value} onclick={() => selectOption(option)}>
          {option}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .select {
    position: relative;
    /* width: 100%; */
    background: #ffffff;
    color: #222;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .select:hover {
    border-color: #aaa;
  }

  .select:focus-within {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.25);
  }

  .selected {
    flex: 1;
  }

  .placeholder {
    color: #999;
  }

  .arrow {
    margin-left: 0.5rem;
    pointer-events: none;
    color: #555;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 0;
    margin: 0;
    list-style: none; /* ✅ removes the bullet dots */
  }

  .dropdown li {
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition:
      background-color 0.15s,
      color 0.15s;
    list-style: none;
  }

  .dropdown li:hover {
    background-color: #f2f2f2;
  }

  .dropdown li.selected {
    background-color: #e8f0fe;
    color: #1a73e8;
    font-weight: 600;
  }
</style>

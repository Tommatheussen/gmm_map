<script lang="ts">
  import { APP_DESCRIPTION, APP_TITLE_FULL } from '$lib/Config';
  import { appState } from '$lib/data/State.svelte';

  const viewText = $derived.by(() => {
    const { baseYear, compareYear } = appState;

    if (compareYear) return `Comparing: ${compareYear} ↔ ${baseYear}`;
    if (baseYear) return `Viewing: ${baseYear}`;
  });
</script>

<header class="header">
  <div class="header-left">
    <img alt="GMM Logo" src="gmm.30a838b0.svg" />
    <div class="titles">
      <span class="title"> {APP_TITLE_FULL}</span>
      <span class="subtitle">{APP_DESCRIPTION}</span>
    </div>
  </div>

  <div class="header-right"><strong>{viewText}</strong></div>
</header>

<style>
  header {
    height: var(--header-height);
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    padding: 0 1rem;
    background: var(--secondary-bg-color);
    color: var(--secondary-text-color);
    font-size: var(--title-size);
  }

  .header-left {
    display: grid;
    gap: 1rem;
    grid-template-columns: auto 1fr;
  }

  .header-left .titles {
    display: grid;
    grid-template-rows: auto auto;
  }

  .title {
    font-size: var(--title-size);
  }

  .subtitle {
    font-size: var(--info-size);
    font-style: italic;
  }

  .header-left img {
    height: 2rem;
    margin: auto;
  }

  .header-right {
    vertical-align: middle;
    white-space: nowrap;
    font-size: var(--label-size);
    text-align: right;
  }
</style>

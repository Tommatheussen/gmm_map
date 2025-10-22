<script lang="ts">
  import { APP_DESCRIPTION, APP_TITLE_FULL, INTRO_VERSION } from '$lib/Config';
  import { onMount } from 'svelte';

  let dialog: HTMLDialogElement;

  onMount(() => {
    const seenIntro = localStorage.getItem('gmm_atlas_intro_seen');
    if (seenIntro !== INTRO_VERSION) dialog.showModal();
  });

  function onDialogClosed() {
    localStorage.setItem('gmm_atlas_intro_seen', INTRO_VERSION);
  }

  function dialogClose() {
    dialog.close();
  }
</script>

<dialog bind:this={dialog} class="intro-dialog" onclose={onDialogClosed}>
  <header class="intro-header">
    <h2 class="intro-title">Welcome to {APP_TITLE_FULL}!</h2>
    <p class="intro-subtitle">{APP_DESCRIPTION}</p>
  </header>

  <section class="intro-body">
    <ul class="intro-list">
      <li>Pick a year to view stages, food, toilets, and more</li>
      <li>Optionally pick a second year to compare changes</li>
      <li>Click on map areas for details</li>
      <li>Show/hide categories</li>
    </ul>
  </section>

  <footer class="intro-footer">
    <button class="intro-close" onclick={dialogClose}>Got it!</button>
  </footer>
</dialog>

<style>
  .intro-dialog {
    border: none;
    border-radius: 0.9rem;
    padding: 1.5rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
    text-align: left;
    background: white;
    animation: scale-in 0.25s ease;
  }

  .intro-dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }

  .intro-header {
    margin-bottom: 1rem;
  }

  .intro-title {
    margin: 0;
    font-size: var(--title-size);
    font-weight: 700;
    color: var(--title-color);
  }

  .intro-subtitle {
    margin: 0.25rem 0 0;
    font-size: var(--info-size);
    font-weight: 400;
    color: var(--info-color);
  }

  .intro-list {
    list-style: none;
    padding-left: 1.25rem;
    margin: 0.5rem 0 1.25rem;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .intro-close {
    padding: 0.5rem 1.1rem;
    background: #4a8ef0;
    border: none;
    color: white;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .intro-close:hover {
    background: #3b7add;
  }

  .intro-list li {
    margin-bottom: 0.25rem;
  }

  .intro-list li::before {
    content: '🤘';
    margin-right: 0.5rem;
    display: inline-block;
  }

  .intro-footer {
    text-align: center;
    margin-top: 0.5rem;
  }

  @keyframes scale-in {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>

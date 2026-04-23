<script lang="ts">
  import { APP_TITLE } from '$lib/Config';
  import { APP_VERSION } from '$lib/Version';
  import WelcomeDialog from './WelcomeDialog.svelte';

  let welcomeDialog: WelcomeDialog;
</script>

<WelcomeDialog bind:this={welcomeDialog} />

<footer class="footer">
  <div class="footer-left">
    <small>
      © {new Date().getFullYear()}
      {APP_TITLE}
      ({APP_VERSION}) —
      <span class="project-info"
        >Unofficial fan project, not affiliated with Graspop Metal Meeting.
      </span>
    </small>
  </div>

  <div class="footer-right">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="#" onclick={welcomeDialog.openDialog}>About</a>
    <span class="divider">•</span>
    <a href="https://www.graspop.be" target="_blank" rel="noopener">Graspop</a>
    <span class="divider">•</span>
    <a href="https://github.com/Tommatheussen/gmm-atlas" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>

<style>
  .footer {
    height: var(--footer-height);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    background: var(--secondary-bg-color);
    color: var(--secondary-text-color);
    font-size: var(--info-size);
  }

  .footer-left {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .footer-right {
    display: flex;
    gap: 1rem;
  }

  .footer a {
    color: var(--secondary-text-color);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer a:hover {
    color: var(--input-bg-color);
  }

  .project-info {
    font-style: italic;
  }

  .divider {
    color: var(--label-color);
    user-select: none;
  }
</style>

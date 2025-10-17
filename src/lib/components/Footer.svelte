<script>
	import { APP_TITLE } from '$lib/Config';
</script>

<footer class="footer">
	<div class="footer-left">
		<small>
			© {new Date().getFullYear()}
			{APP_TITLE} v1.0 — Unofficial fan project, not affiliated with Graspop Metal Meeting.
		</small>
	</div>

	<div class="footer-right">
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
		color: #ccc;
		font-size: 0.85rem;
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
		color: #ccc;
		text-decoration: none;
		transition: color 0.2s;
	}

	.footer a:hover {
		color: #fff;
	}

	.divider {
		color: #555;
		font-weight: 600;
		user-select: none;
	}
</style>

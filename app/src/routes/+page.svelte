<svelte:head>
	<title>Silk UI - Component Library</title>
	<meta
		name="description"
		content="Beautiful, customizable Svelte 5 components with a polished theming system and docs experience."
	/>
</svelte:head>

<div class="win2k-page">
	<!-- Marquee banner -->
	<div class="win2k-marquee-bar">
		<marquee behavior="scroll" direction="left" scrollamount="3">
			🌟 NEW RELEASE: Silk UI v2.0 — Bun-ready, tokenized, and cleaner than ever! &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
			✅ Now featuring 40+ components &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
			💾 Download now and get started for FREE! &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
			🔥 Best Svelte component library of 2000! &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
			📧 Join our mailing list for updates! &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
		</marquee>
	</div>

	<!-- Main content area -->
	<div class="win2k-content">
		<!-- Left sidebar -->
		<div class="win2k-sidebar">
			<div class="win2k-window">
				<div class="win2k-titlebar">
					<span class="win2k-titlebar-text">📁 Navigation</span>
					<div class="win2k-titlebar-buttons">
						<button class="win2k-btn-min">_</button>
						<button class="win2k-btn-max">□</button>
						<button class="win2k-btn-close">✕</button>
					</div>
				</div>
				<div class="win2k-window-body">
					<ul class="win2k-navlist">
						<li><a href="/docs/introduction">📄 Getting Started</a></li>
						<li><a href="/docs/components/alert">🧩 Components</a></li>
						<li><a href="/themes">🎨 Themes</a></li>
						<li><a href="/docs/changelog">📋 Changelog</a></li>
						<li><a href="https://github.com/aidan-neel/ui">🐙 GitHub</a></li>
					</ul>
				</div>
			</div>

			<div class="win2k-window win2k-window-info">
				<div class="win2k-titlebar">
					<span class="win2k-titlebar-text">ℹ️ System Info</span>
					<div class="win2k-titlebar-buttons">
						<button class="win2k-btn-min">_</button>
						<button class="win2k-btn-close">✕</button>
					</div>
				</div>
				<div class="win2k-window-body win2k-sysinfo">
					<p>⚙️ Version: 2.0.0</p>
					<p>📦 Package: silk-ui</p>
					<p>🟢 Status: Online</p>
					<p>🔧 Runtime: Svelte 5</p>
					<hr class="win2k-hr" />
					<p class="win2k-small">Last updated: 04/01/2000</p>
				</div>
			</div>

			<div class="win2k-window win2k-counter-window">
				<div class="win2k-titlebar">
					<span class="win2k-titlebar-text">📊 Visitors</span>
					<div class="win2k-titlebar-buttons">
						<button class="win2k-btn-close">✕</button>
					</div>
				</div>
				<div class="win2k-window-body win2k-counter-body">
					<img
						src="https://www.counters-free.net/count/count.gif"
						alt="visitor counter"
						class="win2k-counter-img"
						onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
					/>
					<div class="win2k-counter-fallback">
						<span class="win2k-counter-digits">007,312</span>
					</div>
					<p class="win2k-small" style="text-align:center; margin-top: 4px;">visitors since Jan 1, 2000</p>
				</div>
			</div>
		</div>

		<!-- Main body -->
		<div class="win2k-main">
			<!-- Hero window -->
			<div class="win2k-window">
				<div class="win2k-titlebar win2k-titlebar-gradient">
					<span class="win2k-titlebar-text">🌐 Welcome to Silk UI — Svelte Component Library</span>
					<div class="win2k-titlebar-buttons">
						<button class="win2k-btn-min">_</button>
						<button class="win2k-btn-max">□</button>
						<button class="win2k-btn-close">✕</button>
					</div>
				</div>
				<div class="win2k-window-body win2k-hero-body">
					<table class="win2k-hero-table">
						<tr>
							<td class="win2k-hero-left">
								<div class="win2k-badge-strip">
									<img src="https://img.shields.io/badge/NEW-Release-red?style=flat" alt="new release badge" />
									<img src="https://img.shields.io/badge/Bun-Ready-yellow?style=flat" alt="bun ready" />
									<img src="https://img.shields.io/badge/Svelte-5-orange?style=flat" alt="svelte 5" />
								</div>
								<h1 class="win2k-hero-title">
									Design-forward Svelte components with calmer defaults and room to make them yours.
								</h1>
								<p class="win2k-hero-desc">
									Silk UI gives you customizable Svelte 5 primitives, elegant defaults, and a styling
									system designed to be remixed instead of fought. Fast to adopt, easy to extend,
									and pleasant to live in.
								</p>
								<div class="win2k-btn-row">
									<a href="/docs/components/alert" class="win2k-button win2k-button-primary">
										Browse Components
									</a>
									<a href="/themes" class="win2k-button">
										Explore Themes
									</a>
									<a href="https://github.com/aidan-neel/ui" class="win2k-button">
										View on GitHub
									</a>
								</div>
								<div class="win2k-feature-strip">
									<div class="win2k-feature-item">
										<span class="win2k-checkmark">✔</span>
										<span><b>Svelte 5</b> — Modern primitives</span>
									</div>
									<div class="win2k-feature-item">
										<span class="win2k-checkmark">✔</span>
										<span><b>Token-first</b> — Theme deeply</span>
									</div>
									<div class="win2k-feature-item">
										<span class="win2k-checkmark">✔</span>
										<span><b>Accessible</b> — Sharper states</span>
									</div>
								</div>
							</td>
							<td class="win2k-hero-right">
								<div class="win2k-inset-panel">
									<div class="win2k-inner-titlebar">
										<span>🖥️ Component Preview</span>
									</div>
									<div class="win2k-preview-body">
										<div class="win2k-preview-btn-row">
											<button class="win2k-button">Normal</button>
											<button class="win2k-button win2k-button-primary">Primary</button>
											<button class="win2k-button" disabled>Disabled</button>
										</div>
										<div class="win2k-progress-container">
											<label class="win2k-label">Loading components...</label>
											<div class="win2k-progress-bar">
												<div class="win2k-progress-fill"></div>
											</div>
										</div>
										<div class="win2k-status-bar-mini">
											<span>🟢 40 components loaded</span>
										</div>
									</div>
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>

			<!-- Features section -->
			<div class="win2k-window win2k-window-features">
				<div class="win2k-titlebar">
					<span class="win2k-titlebar-text">💡 What Makes It Distinct</span>
					<div class="win2k-titlebar-buttons">
						<button class="win2k-btn-min">_</button>
						<button class="win2k-btn-max">□</button>
						<button class="win2k-btn-close">✕</button>
					</div>
				</div>
				<div class="win2k-window-body">
					<p class="win2k-section-intro">
						A calmer UI foundation that stays flexible as your product gets more specific.
					</p>
					<table class="win2k-features-table">
						<tr>
							<td class="win2k-feature-card">
								<div class="win2k-feature-icon">🗂️</div>
								<h3>Composable by default</h3>
								<p>
									Use the pieces as simple drop-ins or reshape them into product-specific patterns
									without rewriting the entire stack.
								</p>
							</td>
							<td class="win2k-feature-card">
								<div class="win2k-feature-icon">🎨</div>
								<h3>Real theming system</h3>
								<p>
									Semantic tokens, cleaner presets, and enough hooks to make the library feel like
									your own design language.
								</p>
							</td>
							<td class="win2k-feature-card">
								<div class="win2k-feature-icon">✅</div>
								<h3>Polished interaction states</h3>
								<p>
									Focus, motion, borders, and surfaces are tuned to feel quiet and intentional
									instead of flashy or unfinished.
								</p>
							</td>
						</tr>
					</table>
				</div>
			</div>

			<!-- CTA Section -->
			<div class="win2k-window">
				<div class="win2k-titlebar win2k-titlebar-teal">
					<span class="win2k-titlebar-text">🚀 Start From A Stronger Baseline</span>
					<div class="win2k-titlebar-buttons">
						<button class="win2k-btn-min">_</button>
						<button class="win2k-btn-max">□</button>
						<button class="win2k-btn-close">✕</button>
					</div>
				</div>
				<div class="win2k-window-body win2k-cta-body">
					<table class="win2k-cta-table">
						<tr>
							<td class="win2k-cta-left">
								<p class="win2k-label" style="color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">START HERE</p>
								<h2 class="win2k-cta-title">Start from a stronger baseline.</h2>
								<p>Open the docs, copy a component, and customize from a better default baseline.</p>
							</td>
							<td class="win2k-cta-right">
								<a href="/docs/introduction" class="win2k-button win2k-button-primary win2k-button-large">
									📖 Read the Docs
								</a>
								<br />
								<a href="/docs/components/alert-dialog" class="win2k-button win2k-button-large" style="margin-top: 8px; display: inline-block;">
									🧩 See Component Examples
								</a>
							</td>
						</tr>
					</table>
				</div>
			</div>

			<!-- Footer -->
			<div class="win2k-footer">
				<div class="win2k-footer-inner">
					<hr class="win2k-hr" />
					<table class="win2k-footer-table">
						<tr>
							<td class="win2k-footer-left">
								<b>Silk UI</b><br />
								<span class="win2k-small">Calmer defaults for teams that still want control.</span>
							</td>
							<td class="win2k-footer-links">
								<a href="/docs/introduction">Docs</a> |
								<a href="/docs/components">Components</a> |
								<a href="/themes">Themes</a> |
								<a href="https://github.com/aidan-neel/ui">GitHub</a>
							</td>
						</tr>
					</table>
					<p class="win2k-small" style="text-align: center; color: #666; margin-top: 8px;">
						© 2000 Silk UI. Best viewed in Internet Explorer 5.5 at 800×600 resolution.
						&nbsp;|&nbsp; 🔒 This site is SSL secured.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Windows taskbar-style status bar -->
	<div class="win2k-statusbar">
		<span class="win2k-status-item">🖥️ Silk UI v2.0</span>
		<span class="win2k-status-sep">|</span>
		<span class="win2k-status-item">📁 40 Components</span>
		<span class="win2k-status-sep">|</span>
		<span class="win2k-status-item">🟢 Online</span>
		<span class="win2k-status-sep">|</span>
		<span class="win2k-status-item win2k-status-right">🕐 04/01/2000 12:00 PM</span>
	</div>
</div>

<style>
	/* ===================== WIN2K BASE ===================== */
	:global(body) {
		background-color: #008080 !important;
		background-image: none !important;
		font-family: 'Tahoma', 'Verdana', 'Arial', sans-serif !important;
		font-size: 12px !important;
	}

	/* Hide the existing navbar */
	:global(main > nav),
	:global(header),
	:global(nav) {
		display: none !important;
	}

	.win2k-page {
		font-family: 'Tahoma', 'Verdana', 'Arial', sans-serif;
		font-size: 12px;
		color: #000000;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: #008080;
		padding: 8px;
		padding-bottom: 0;
		gap: 4px;
	}

	/* ===================== MARQUEE BAR ===================== */
	.win2k-marquee-bar {
		background: linear-gradient(to right, #000080, #1084d0);
		color: #ffffff;
		font-size: 11px;
		font-weight: bold;
		padding: 3px 6px;
		border: 2px solid;
		border-color: #ffffff #808080 #808080 #ffffff;
	}

	/* ===================== LAYOUT ===================== */
	.win2k-content {
		display: flex;
		flex-direction: row;
		gap: 6px;
		flex: 1;
		align-items: flex-start;
	}

	/* ===================== SIDEBAR ===================== */
	.win2k-sidebar {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 180px;
		flex-shrink: 0;
	}

	/* ===================== MAIN AREA ===================== */
	.win2k-main {
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
		min-width: 0;
	}

	/* ===================== WINDOW ===================== */
	.win2k-window {
		background: #d4d0c8;
		border: 2px solid;
		border-color: #ffffff #808080 #808080 #ffffff;
		box-shadow: inset 1px 1px 0 #dfdfdf, 1px 1px 2px rgba(0,0,0,0.4);
	}

	/* ===================== TITLE BAR ===================== */
	.win2k-titlebar {
		background: linear-gradient(to right, #000080 0%, #1084d0 100%);
		color: #ffffff;
		font-size: 11px;
		font-weight: bold;
		padding: 3px 4px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		user-select: none;
	}

	.win2k-titlebar-gradient {
		background: linear-gradient(to right, #000080 0%, #3a6ea5 100%);
	}

	.win2k-titlebar-teal {
		background: linear-gradient(to right, #006060 0%, #008080 100%);
	}

	.win2k-titlebar-text {
		font-size: 11px;
		font-weight: bold;
	}

	.win2k-titlebar-buttons {
		display: flex;
		gap: 2px;
	}

	.win2k-btn-min,
	.win2k-btn-max,
	.win2k-btn-close {
		width: 16px;
		height: 14px;
		font-size: 9px;
		font-weight: bold;
		background: #d4d0c8;
		color: #000000;
		border: 1px solid;
		border-color: #ffffff #808080 #808080 #ffffff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		line-height: 1;
	}

	.win2k-btn-close {
		background: #d4d0c8;
	}

	.win2k-btn-min:active,
	.win2k-btn-max:active,
	.win2k-btn-close:active {
		border-color: #808080 #ffffff #ffffff #808080;
	}

	/* ===================== WINDOW BODY ===================== */
	.win2k-window-body {
		padding: 8px;
		background: #d4d0c8;
	}

	/* ===================== NAV LIST ===================== */
	.win2k-navlist {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.win2k-navlist li {
		border-bottom: 1px solid #a0a0a0;
	}

	.win2k-navlist li:last-child {
		border-bottom: none;
	}

	.win2k-navlist a {
		display: block;
		padding: 4px 6px;
		color: #000080;
		text-decoration: none;
		font-size: 11px;
	}

	.win2k-navlist a:hover {
		background: #000080;
		color: #ffffff;
		text-decoration: none;
	}

	/* ===================== SYSTEM INFO ===================== */
	.win2k-sysinfo {
		font-size: 10px;
		line-height: 1.8;
	}

	.win2k-sysinfo p {
		margin: 0;
	}

	.win2k-hr {
		border: none;
		border-top: 1px solid #808080;
		border-bottom: 1px solid #ffffff;
		margin: 4px 0;
	}

	.win2k-small {
		font-size: 10px;
		color: #444;
	}

	/* ===================== COUNTER ===================== */
	.win2k-counter-body {
		text-align: center;
	}

	.win2k-counter-img {
		max-width: 100%;
	}

	.win2k-counter-fallback {
		display: none;
	}

	.win2k-counter-digits {
		font-family: 'Courier New', monospace;
		font-size: 18px;
		font-weight: bold;
		color: #000;
		background: #000;
		color: #00ff00;
		padding: 2px 6px;
		letter-spacing: 2px;
		border: 2px inset #808080;
		display: inline-block;
	}

	/* Show fallback counter always */
	.win2k-counter-fallback {
		display: block;
	}

	/* ===================== HERO ===================== */
	.win2k-hero-body {
		padding: 10px;
	}

	.win2k-hero-table {
		width: 100%;
		border-collapse: collapse;
	}

	.win2k-hero-table td {
		vertical-align: top;
		padding: 4px;
	}

	.win2k-hero-left {
		width: 60%;
	}

	.win2k-hero-right {
		width: 40%;
	}

	.win2k-badge-strip {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
		margin-bottom: 8px;
	}

	.win2k-badge-strip img {
		height: 18px;
	}

	.win2k-hero-title {
		font-size: 18px;
		font-weight: bold;
		color: #000080;
		margin: 0 0 8px 0;
		line-height: 1.3;
		font-family: 'Tahoma', 'Verdana', sans-serif;
	}

	.win2k-hero-desc {
		font-size: 11px;
		line-height: 1.6;
		margin: 0 0 10px 0;
		color: #222;
	}

	.win2k-btn-row {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-bottom: 12px;
	}

	.win2k-feature-strip {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-top: 1px solid #a0a0a0;
		border-bottom: 1px solid #ffffff;
		padding: 6px 0;
	}

	.win2k-feature-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
	}

	.win2k-checkmark {
		color: #008000;
		font-weight: bold;
		font-size: 12px;
	}

	/* ===================== INSET PANEL ===================== */
	.win2k-inset-panel {
		border: 2px solid;
		border-color: #808080 #ffffff #ffffff #808080;
		background: #d4d0c8;
	}

	.win2k-inner-titlebar {
		background: #c0c0c0;
		border-bottom: 1px solid #808080;
		padding: 2px 4px;
		font-size: 10px;
		font-weight: bold;
	}

	.win2k-preview-body {
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.win2k-preview-btn-row {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}

	/* ===================== PROGRESS BAR ===================== */
	.win2k-progress-container {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.win2k-label {
		font-size: 11px;
		font-weight: bold;
	}

	.win2k-progress-bar {
		height: 16px;
		background: #ffffff;
		border: 2px solid;
		border-color: #808080 #ffffff #ffffff #808080;
		overflow: hidden;
	}

	.win2k-progress-fill {
		height: 100%;
		width: 72%;
		background: repeating-linear-gradient(
			90deg,
			#000080 0px,
			#000080 8px,
			#ffffff 8px,
			#ffffff 10px
		);
		animation: win2k-progress 2s ease-in-out infinite;
	}

	@keyframes win2k-progress {
		0% { width: 20%; }
		50% { width: 85%; }
		100% { width: 20%; }
	}

	.win2k-status-bar-mini {
		background: #c0c0c0;
		border: 1px solid;
		border-color: #808080 #ffffff #ffffff #808080;
		padding: 2px 4px;
		font-size: 10px;
	}

	/* ===================== BUTTONS ===================== */
	.win2k-button {
		display: inline-block;
		background: #d4d0c8;
		color: #000000;
		border: 2px solid;
		border-color: #ffffff #808080 #808080 #ffffff;
		padding: 3px 10px;
		font-family: 'Tahoma', 'Verdana', sans-serif;
		font-size: 11px;
		font-weight: bold;
		text-decoration: none;
		cursor: pointer;
		box-shadow: 1px 1px 0 #000000;
		outline: 1px dotted transparent;
		user-select: none;
	}

	.win2k-button:hover {
		background: #e4e0d8;
		text-decoration: none;
		color: #000000;
	}

	.win2k-button:active {
		border-color: #808080 #ffffff #ffffff #808080;
		box-shadow: none;
		padding: 4px 9px 2px 11px;
	}

	.win2k-button:focus {
		outline: 1px dotted #000000;
	}

	.win2k-button:disabled {
		color: #808080;
		text-shadow: 1px 1px 0 #ffffff;
	}

	.win2k-button-primary {
		background: linear-gradient(to bottom, #1084d0 0%, #000080 100%);
		color: #ffffff;
		border-color: #6ab0e0 #00005a #00005a #6ab0e0;
	}

	.win2k-button-primary:hover {
		background: linear-gradient(to bottom, #3094e0 0%, #0000a0 100%);
		color: #ffffff;
	}

	.win2k-button-large {
		padding: 5px 14px;
		font-size: 12px;
	}

	/* ===================== FEATURES SECTION ===================== */
	.win2k-section-intro {
		font-size: 12px;
		font-weight: bold;
		color: #000080;
		margin: 0 0 8px 0;
		border-bottom: 2px solid #000080;
		padding-bottom: 4px;
	}

	.win2k-features-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 6px;
	}

	.win2k-feature-card {
		vertical-align: top;
		background: #ffffff;
		border: 2px solid;
		border-color: #808080 #ffffff #ffffff #808080;
		padding: 8px;
		width: 33%;
	}

	.win2k-feature-icon {
		font-size: 24px;
		margin-bottom: 4px;
	}

	.win2k-feature-card h3 {
		font-size: 11px;
		font-weight: bold;
		color: #000080;
		margin: 0 0 4px 0;
	}

	.win2k-feature-card p {
		font-size: 11px;
		line-height: 1.5;
		margin: 0;
		color: #333;
	}

	/* ===================== CTA SECTION ===================== */
	.win2k-cta-body {
		padding: 12px;
	}

	.win2k-cta-table {
		width: 100%;
		border-collapse: collapse;
	}

	.win2k-cta-table td {
		padding: 4px 8px;
		vertical-align: middle;
	}

	.win2k-cta-left {
		width: 65%;
	}

	.win2k-cta-right {
		width: 35%;
		text-align: right;
	}

	.win2k-cta-title {
		font-size: 16px;
		font-weight: bold;
		color: #000080;
		margin: 4px 0;
	}

	/* ===================== FOOTER ===================== */
	.win2k-footer {
		background: #d4d0c8;
		border: 2px solid;
		border-color: #ffffff #808080 #808080 #ffffff;
	}

	.win2k-footer-inner {
		padding: 8px;
	}

	.win2k-footer-table {
		width: 100%;
		border-collapse: collapse;
	}

	.win2k-footer-table td {
		padding: 2px 4px;
		vertical-align: middle;
	}

	.win2k-footer-left {
		width: 50%;
	}

	.win2k-footer-links {
		text-align: right;
	}

	.win2k-footer-links a {
		color: #000080;
		text-decoration: underline;
		font-size: 11px;
		padding: 0 2px;
	}

	.win2k-footer-links a:hover {
		color: #ff0000;
	}

	/* ===================== STATUSBAR ===================== */
	.win2k-statusbar {
		position: sticky;
		bottom: 0;
		background: #d4d0c8;
		border-top: 2px solid #ffffff;
		padding: 3px 8px;
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		margin: 4px -8px -4px;
	}

	.win2k-status-sep {
		color: #808080;
	}

	.win2k-status-right {
		margin-left: auto;
	}

	.win2k-window-info {}
	.win2k-window-features {}
	.win2k-counter-window {}

	/* ===================== RESPONSIVE ===================== */
	@media (max-width: 768px) {
		.win2k-content {
			flex-direction: column;
		}
		.win2k-sidebar {
			width: 100%;
		}
		.win2k-hero-table,
		.win2k-hero-table tr,
		.win2k-hero-table td {
			display: block;
			width: 100%;
		}
		.win2k-features-table,
		.win2k-features-table tr,
		.win2k-feature-card {
			display: block;
			width: 100%;
		}
		.win2k-cta-table,
		.win2k-cta-table tr,
		.win2k-cta-table td {
			display: block;
			width: 100%;
		}
		.win2k-cta-right {
			text-align: left;
		}
	}
</style>

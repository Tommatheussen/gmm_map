[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub Pages](https://img.shields.io/badge/View%20Live-GMM%20Atlas-blue?logo=github)](https://tommatheussen.github.io/gmm-atlas/)

# Graspop Metal Meeting Atlas (GMM Atlas)

**GMM Atlas** is an interactive web application that visualizes the official **Graspop Metal Meeting** festival grounds.
It allows you to explore historical layouts of the festival site (dating back to 2022), compare different years side by side, and inspect individual points of interest (POIs) — all directly in your browser.

🌐 **Live site:** [tommatheussen.github.io/gmm-atlas](https://tommatheussen.github.io/gmm-atlas/)

---

## 🎸 Features

- **Year selector:** View festival grounds from any available year
- **Comparison mode:** Display two years side by side to see layout changes
- **Interactive map:** Click POIs (like “Toilet”, “Campsite A.2”, etc.) for details
- **Category styling:** Each POI category (e.g., stages, camping, facilities) is color-coded
- **Leaflet-based viewer:** Smooth zooming, panning, and overlay rendering

Built with:

- [SvelteKit 5](https://kit.svelte.dev/)
- [Leaflet 2.0.0](https://leafletjs.com/)
- TypeScript
- Devcontainer-based development environment
- ESLint and pre-commit checks for consistent code quality

---

## 📦 Data Source

All map data is based on **official Graspop Metal Meeting app data**, which is publicly accessible.
Data is fetched using [Bruno](https://www.usebruno.com/) and minimally processed — mostly removing unnecessary top-level properties — before being stored as structured JSON files:

- `layers.json`: defines POI categories and visual styling
- `pois.json`: contains coordinates, polygons, and metadata for map elements
- `overrides.json`: allows overriding of source data, while preserving the original. This helps us move data accross different years to the same layers.

Each year has its own data folder containing these three files.

> ⚠️ Data © Graspop Metal Meeting. This project is a **fan-made visualization tool** and not affiliated with the festival organizers.

---

## 🚀 Development

This project is fully containerized — **no local setup needed** beyond Docker and VS Code (or any devcontainer-compatible IDE).

### 🧩 Getting started

1. Clone the repository

```bash
  git clone https://github.com/tommatheussen/gmm-atlas.git
  cd gmm-atlas
```

2. Open in VS Code — it will automatically build and start the Dev Container.
3. Start the development server:

```bash
  npm run dev
```

4. Open your browser at the shown URL.

### 🧰 Contributing

Contributions are welcome!

- Create a new branch from `dev`
- Make your changes
- Run the format/lint checks
- Submit a Pull Request against `dev`

Pre-commit hooks and ESLint will verify formatting and code consistency automatically.

### 🌍 Deployment

Deployment is handled via GitHub Actions and GitHub Pages.
When a new release is published, the workflow builds and deploys the app automatically.

The latest deployed version is available at: 👉 https://tommatheussen.github.io/gmm-atlas/

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
Festival data © Graspop Metal Meeting — used for educational and fan purposes only.

## 🏗️ Roadmap / Ideas
- [ ] Responsive, mobile layout?

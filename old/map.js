async function setupMap() {
	const layers_2024 = await setupDataForYear(2023);
	const layers_2025 = await setupDataForYear(2025);

	L.control.splitMap(layers_2024, layers_2025).addTo(map);
}

async function setupDataForYear(year) {
	const year_layergroup = L.layerGroup().addTo(map);

	const year_data = await loadDataForYear(year);
	createMapPanes(year_data.layers);

	year_data.pois.forEach((entry) => {
		if (entry.deleted_at) return;

		const category = year_data.layers.find((categoryM) => categoryM.id === entry.category_id);

		if (!category) {
			console.warn(`Map layer not found, ${entry.name} - ${entry.id}`);
			return;
		}

		const color = category?.color || '#FF0000';

		let popupData = `
      <div class="popup-content">
        <h4 class="popup-title">
          ${category.name.trim() == entry.name.trim() ? entry.name : category.name + ' - ' + entry.name}
        </h4>
    `;

		if (entry.tags && entry.tags.length > 0) {
			popupData += createTags(entry.tags);
		}

		// if (entry.body) {
		//   popupData += `<br>${entry.body}`;
		// }

		const isGroundLayer = groundLayersFixedIds.includes(category.fixed_id);

		popupData += '</div>';

		L.polygon(entry.coordinates, {
			color: color,
			strokeWidth: 1,
			strokeOpacity: isGroundLayer ? 1 : 0.75,
			fillOpacity: isGroundLayer ? 1 : 0.75,
			pane: `${entry.category_id}`
		})
			.addTo(year_layergroup)
			.bindPopup(popupData);
	});

	return year_layergroup;
}

function createTags(tags) {
	let content = `<div class="tags">`;

	tags.forEach((tag) => {
		content += `<span class="popup-tag">${tag.name}</span>`;
	});

	content += `</div>`;
	return content;
}

setupMap();

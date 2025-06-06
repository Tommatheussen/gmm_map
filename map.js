const map = L.map('map').setView([51.22793672757168, 5.0726501221594955], 18);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 22,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

async function loadDataForYear(year) {
  const pois = await fetch(`data/${year}/pois.json`).then(response => response.json());
  const layers = await fetch(`data/${year}/layers.json`).then(response => response.json());

  return { pois, layers }
}

const groundLayersFixedIds = [
  44,
  35,
  20
]

async function createMapPanes(layers) {
  layers.forEach(layer => {
    const existingPane = Object.keys(map.getPanes()).find(pane => pane == layer.id);

    if (!existingPane) {
      map.createPane(`${layer.id}`);
      map.getPane(`${layer.id}`).style.zIndex = 400 + layer.z_index;
    }
  })
}

async function setupMap() {
  addInfoBox();

  const layers_2024 = await setupDataForYear(2024);
  const layers_2025 = await setupDataForYear(2025);

  L.control.splitMap(layers_2024, layers_2025).addTo(map);
}

async function setupDataForYear(year) {
  const year_layergroup = L.layerGroup().addTo(map);

  const year_data = await loadDataForYear(year);
  createMapPanes(year_data.layers);

  year_data.pois.forEach(entry => {
    if (entry.deleted_at) return;

    const category = year_data.layers.find(categoryM => categoryM.id === entry.category_id);

    if (!category) {
      console.warn(`Map layer not found, ${entry.name} - ${entry.id}`);
    }

    const color = category?.color || '#FF0000';

    let popupData = `
      <div class="popup-content">
        <h4 class="popup-title">
          ${category.name.trim() == entry.name.trim() ? entry.name : category.name + " - " + entry.name}
        </h4>
    `;

    if (entry.tags && entry.tags.length > 0) {
      popupData += createTags(entry.tags)
    }

    // if (entry.body) {
    //   popupData += `<br>${entry.body}`;
    // }

    const isGroundLayer = groundLayersFixedIds.includes(category.fixed_id);

    popupData += "</div>";

    L.polygon(entry.coordinates, {
      color: color,
      strokeWidth: 1,
      strokeOpacity: isGroundLayer ? 1 : 0.75,
      fillOpacity: isGroundLayer ? 1 : 0.75,
      pane: `${entry.category_id}`
    }).addTo(year_layergroup).bindPopup(popupData);
  });

  return year_layergroup;
}

function createTags(tags) {
  let content = `<div class="tags">`

  tags.forEach(tag => {
    content += `<span class="popup-tag">${tag.name}</span>`
  });

  content += `</div>`;
  return content;
}

function addInfoBox() {
  const infoContol = L.control();

  infoContol.onAdd = function (map) {
    const _div = L.DomUtil.create('div', 'info');

    _div.innerHTML = `<h4>GMM Map comparison</h4>
      <div>
        This simple tool shows the differences in the festival terrain between 2024 (left) and 2025 (right).<br>
        Drag the slider to start comparing!
      </div>
    `
    return _div;
  };

  infoContol.addTo(map);
}

setupMap();

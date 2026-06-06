/* ============================================================
   RP NGOMA COLLEGE — GIS MAP EXPLORER
   app.js  |  Author: BYIRINGIRO Jean Bosco (25RP18520)
   ============================================================ */

/* ── MAP DATA ── */
const maps = [
  {
    img: "map1_location.jpeg",
    num: "Map 01",
    title: "Administrative Location Context",
    short: "Multi-panel location reference map showing the spatial hierarchy from Ngoma District down to the college site.",
    desc: "This multi-panel location map establishes the full geographic and administrative context of the study area. Using red arrows to connect each zoom level, it creates a clear spatial drill-down from Ngoma District through Kibungo Sector and Karenge Cell down to the RP Ngoma College boundary — a standard GIS project cartographic layout technique.",
    features: [
      "Ngoma District overview showing all 12 sectors",
      "Kibungo Sector cells: Gatonde, Gahima, Cyasemakamba, Mahango, Karenge (highlighted green)",
      "Karenge Cell villages: Kabeza, Ubumwe, Gatare, Ihuriko, Amahoro, Isangano, Musamvu",
      "RP Ngoma College boundary shown as standalone inset",
      "Red arrow connectors showing spatial hierarchy drill-down",
      "Kabeza village highlighted in pink as study sub-area"
    ],
    facts: [
      { k: "Map Type",    v: "Multi-panel Location" },
      { k: "Admin Level", v: "District → Cell" },
      { k: "District",    v: "Ngoma" },
      { k: "Sector",      v: "Kibungo" },
      { k: "Cell",        v: "Karenge" },
      { k: "Village",     v: "Ihuriro" }
    ],
    tags: ["Location", "Administrative", "Multi-panel", "Hierarchy"]
  },
  {
    img: "map2_3d_topo.jpeg",
    num: "Map 02",
    title: "3D Topographic Campus Map",
    short: "Photorealistic 3D rendered campus map with contour lines showing terrain relief and all digitized features.",
    desc: "A 3D rendered topographic map of the entire RP Ngoma College campus. Buildings are color-coded by function and rendered with realistic 3D volumes, while terrain relief is shown through contour lines at 5-metre intervals. The campus sits on hilly terrain with elevations ranging from 1,585 m to 1,630 m — a 45-metre relief typical of Rwanda's landscape. An aerial photo image is overlaid on the digital terrain model with 3D buildings and land use zoning.",
    features: [
      "Contour lines from 1,585 m to 1,630 m elevation (5 m interval)",
      "30+ campus features digitized and rendered in photorealistic 3D",
      "Academic: classrooms, B-Tech classes, civil/carpentry/mason/plumbing/mech. workshops",
      "Residential: boys' and girls' dormitories, lodges, house of players",
      "Infrastructure: roads, streets, fence, car parking, generator house, toilets",
      "Recreation: football pitch, prayer ground, garden areas, shiminy"
    ],
    facts: [
      { k: "Map Type",      v: "3D Topographic" },
      { k: "Elevation Min", v: "1,585 m" },
      { k: "Elevation Max", v: "1,630 m" },
      { k: "Relief Range",  v: "45 m" },
      { k: "Contour Intv.", v: "5 metres" },
      { k: "Features",      v: "30+ buildings" }
    ],
    tags: ["3D", "Topographic", "Campus", "Elevation", "ArcGIS"]
  },
  {
    img: "map3_satellite.jpeg",
    num: "Map 03",
    title: "Georeferenced Google Earth Image",
    short: "High-resolution satellite imagery georeferenced with 4 ground control points and the college boundary polygon.",
    desc: "A georeferenced Google Earth satellite image of RP Ngoma College, aligned to real-world UTM coordinates using four ground control points (GCPs). The red boundary polygon precisely delineates the college perimeter. The image reveals real buildings, roads, vegetation patterns, and the surrounding semi-urban community in authentic aerial perspective — cross-referenced with DGPS field data.",
    features: [
      "4 ground control points (P1–P4) with precise geographic coordinates",
      "Red boundary polygon precisely outlining the college perimeter",
      "Real vegetation canopy, buildings, and internal road network visible",
      "Surrounding Ihuriro village and community context preserved",
      "Coordinate grid in UTM Zone 36S (Transverse Mercator)",
      "Semi-urban setting with mixed agricultural and institutional land use"
    ],
    facts: [
      { k: "Map Type", v: "Satellite / Georef." },
      { k: "P1",       v: "2°8′47.57″S 30°32′35.57″E" },
      { k: "P2",       v: "2°8′59.11″S 30°32′39.49″E" },
      { k: "P3",       v: "2°8′57.61″S 30°32′29.65″E" },
      { k: "P4",       v: "2°8′49.32″S 30°32′28.29″E" },
      { k: "Author",   v: "BYIRINGIRO Jean Bosco" }
    ],
    tags: ["Satellite", "Georeferencing", "GCP", "Google Earth", "DGPS"]
  },
  {
    img: "map4_2d_topo.jpeg",
    num: "Map 04",
    title: "2D Topographic Campus Map",
    short: "Planimetric 2D version of the campus map for precise measurement and spatial analysis with full symbology.",
    desc: "The 2D planimetric topographic map presents the same campus data as Map 02 but using standard flat GIS symbology optimized for measurement and spatial analysis. Contour lines are more clearly legible, trees are represented as dot symbols, and all buildings use fill patterns and solid colors per cartographic convention. Ideal for area calculations, buffer analysis, and distance measurements. Includes all 35 legend categories.",
    features: [
      "Standard 2D planimetric GIS representation (flat projection)",
      "Contour lines clearly readable at 5 m intervals (1,585 – 1,630 m)",
      "Tree dots distributed across campus showing canopy coverage",
      "Hatching patterns for workshops and special-use areas",
      "Same 30+ features as 3D map in standardized symbology",
      "Complete cartographic legend with 35 feature categories"
    ],
    facts: [
      { k: "Map Type",      v: "2D Planimetric" },
      { k: "Projection",    v: "Transverse Mercator" },
      { k: "Scale Bar",     v: "0 – 0.16 km" },
      { k: "Contour Lines", v: "5 m interval" },
      { k: "Legend Items",  v: "35 categories" },
      { k: "Linear Unit",   v: "Metre (1.0)" }
    ],
    tags: ["2D", "Planimetric", "Analysis", "Topographic", "Symbology"]
  }
];

/* ── STATE ── */
let currentMap = 0;
let zoomLevel  = 1;

/* ── BUILD MAP CARDS ── */
function buildCards() {
  const grid = document.getElementById('maps-grid');
  maps.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'map-card';
    card.onclick   = () => openLightbox(i);
    card.innerHTML = `
      <img class="map-card-img" src="${m.img}" alt="${m.title}" loading="lazy">
      <div class="map-card-body">
        <div class="map-card-num">${m.num}</div>
        <div class="map-card-title">${m.title}</div>
        <div class="map-card-desc">${m.short}</div>
        <div class="map-card-tags">${m.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ── LIGHTBOX ── */
function openLightbox(idx) {
  currentMap = idx;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  resetZoom();
}

function renderLightbox() {
  const m = maps[currentMap];

  document.getElementById('lb-img').src   = m.img;
  document.getElementById('lb-num').textContent   = m.num;
  document.getElementById('lb-title').textContent = m.title;
  document.getElementById('lb-desc').textContent  = m.desc;

  // Features list
  const ul = document.getElementById('lb-features');
  ul.innerHTML = m.features.map(f => `<li>${f}</li>`).join('');

  // Technical facts grid
  const facts = document.getElementById('lb-facts');
  facts.innerHTML = m.facts.map(f => `
    <div class="lb-fact">
      <div class="lb-fact-key">${f.k}</div>
      <div class="lb-fact-val">${f.v}</div>
    </div>
  `).join('');

  // Prev / Next buttons
  document.getElementById('btn-prev').disabled = currentMap === 0;
  document.getElementById('btn-next').disabled = currentMap === maps.length - 1;

  resetZoom();
}

function navigateMap(dir) {
  const next = currentMap + dir;
  if (next >= 0 && next < maps.length) {
    currentMap = next;
    renderLightbox();
  }
}

/* ── ZOOM ── */
function zoomImg(factor) {
  zoomLevel = Math.min(4, Math.max(0.5, zoomLevel * factor));
  document.getElementById('lb-img').style.transform = `scale(${zoomLevel})`;
}

function resetZoom() {
  zoomLevel = 1;
  const img = document.getElementById('lb-img');
  if (img) img.style.transform = 'scale(1)';
}

/* ── NAV SCROLL ── */
function navScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── ACTIVE NAV TAB ON SCROLL ── */
const sectionIds = ['maps', 'about', 'objectives', 'methodology', 'schedule', 'projection', 'references'];

function updateActiveTab() {
  let activeIdx = 0;
  sectionIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 130) activeIdx = i;
  });
  document.querySelectorAll('.nav-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === activeIdx);
  });
}

/* ── EVENT LISTENERS ── */
// Close lightbox on backdrop click
document.getElementById('lightbox').addEventListener('click', function (e) {
  if (e.target === this) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowRight')  navigateMap(1);
  if (e.key === 'ArrowLeft')   navigateMap(-1);
  if (e.key === '+')           zoomImg(1.25);
  if (e.key === '-')           zoomImg(0.8);
});

// Scroll-based active tab
window.addEventListener('scroll', updateActiveTab, { passive: true });

/* ── INIT ── */
buildCards();
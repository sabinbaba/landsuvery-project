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
    desc: "A 3D rendered topographic map of the entire RP Ngoma College campus. Buildings are color-coded by function and rendered with realistic 3D volumes, while terrain relief is shown through contour lines at 5-metre intervals. The campus sits on hilly terrain with elevations ranging from 1,585 m to 1,630 m — a 45-metre relief typical of Rwanda's landscape.",
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
    desc: "A georeferenced Google Earth satellite image of RP Ngoma College, aligned to real-world UTM coordinates using four ground control points (GCPs). The red boundary polygon precisely delineates the college perimeter. The image reveals real buildings, roads, vegetation patterns, and the surrounding semi-urban community in authentic aerial perspective.",
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
    desc: "The 2D planimetric topographic map presents the same campus data using standard flat GIS symbology optimized for measurement and spatial analysis. Contour lines are more clearly legible, trees are represented as dot symbols, and all buildings use fill patterns per cartographic convention. Ideal for area calculations, buffer analysis, and distance measurements.",
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

/* ══════════════════════════════════════════════
   ZOOM & PAN STATE
══════════════════════════════════════════════ */
let currentMap  = 0;
let zoomLevel   = 1;
const ZOOM_MIN  = 0.5;
const ZOOM_MAX  = 8;
const ZOOM_STEP = 1.35;

// Pan (drag) state
let isPanning   = false;
let panStartX   = 0;
let panStartY   = 0;
let scrollStartX = 0;
let scrollStartY = 0;

/* ── helpers ── */
function getWrap()   { return document.getElementById('img-wrap'); }
function getImg()    { return document.getElementById('lb-img'); }
function getLabel()  { return document.getElementById('zoom-label'); }

function applyZoom() {
  const img = getImg();
  img.style.transform = `scale(${zoomLevel})`;
  getLabel().textContent = Math.round(zoomLevel * 100) + '%';
}

function zoomIn()  { zoomLevel = Math.min(ZOOM_MAX, zoomLevel * ZOOM_STEP); applyZoom(); }
function zoomOut() { zoomLevel = Math.max(ZOOM_MIN, zoomLevel / ZOOM_STEP); applyZoom(); }

function resetZoom() {
  zoomLevel = 1;
  applyZoom();
  // re-centre
  const wrap = getWrap();
  if (wrap) { wrap.scrollLeft = 0; wrap.scrollTop = 0; }
}

/* ── Mouse-wheel zoom centred on cursor ── */
function handleWheel(e) {
  e.preventDefault();
  const wrap  = getWrap();
  const img   = getImg();
  const rect  = wrap.getBoundingClientRect();

  // cursor position relative to visible area
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;

  // cursor position in the scrolled content
  const contentX = cx + wrap.scrollLeft;
  const contentY = cy + wrap.scrollTop;

  const prevZoom = zoomLevel;
  const delta    = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
  zoomLevel      = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomLevel * delta));
  applyZoom();

  // adjust scroll so the point under the cursor stays fixed
  const scale     = zoomLevel / prevZoom;
  wrap.scrollLeft = contentX * scale - cx;
  wrap.scrollTop  = contentY * scale - cy;
}

/* ── Click-and-drag pan ── */
function onMouseDown(e) {
  if (e.button !== 0) return;
  const wrap = getWrap();
  isPanning    = true;
  panStartX    = e.clientX;
  panStartY    = e.clientY;
  scrollStartX = wrap.scrollLeft;
  scrollStartY = wrap.scrollTop;
  wrap.classList.add('grabbing');
  e.preventDefault();
}

function onMouseMove(e) {
  if (!isPanning) return;
  const wrap = getWrap();
  wrap.scrollLeft = scrollStartX - (e.clientX - panStartX);
  wrap.scrollTop  = scrollStartY - (e.clientY - panStartY);
}

function onMouseUp() {
  if (!isPanning) return;
  isPanning = false;
  getWrap().classList.remove('grabbing');
}

/* ── Touch pinch-zoom + pan ── */
let lastTouchDist = null;
let lastTouchMid  = null;

function getTouchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function getTouchMid(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2
  };
}

function onTouchStart(e) {
  if (e.touches.length === 2) {
    lastTouchDist = getTouchDist(e.touches);
    lastTouchMid  = getTouchMid(e.touches);
    e.preventDefault();
  } else if (e.touches.length === 1) {
    const wrap   = getWrap();
    isPanning    = true;
    panStartX    = e.touches[0].clientX;
    panStartY    = e.touches[0].clientY;
    scrollStartX = wrap.scrollLeft;
    scrollStartY = wrap.scrollTop;
  }
}

function onTouchMove(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dist   = getTouchDist(e.touches);
    const mid    = getTouchMid(e.touches);
    const wrap   = getWrap();
    const rect   = wrap.getBoundingClientRect();

    const cx = mid.x - rect.left;
    const cy = mid.y - rect.top;
    const contentX = cx + wrap.scrollLeft;
    const contentY = cy + wrap.scrollTop;

    const prevZoom = zoomLevel;
    zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomLevel * (dist / lastTouchDist)));
    applyZoom();

    const scale     = zoomLevel / prevZoom;
    wrap.scrollLeft = contentX * scale - cx;
    wrap.scrollTop  = contentY * scale - cy;

    lastTouchDist = dist;
    lastTouchMid  = mid;
  } else if (e.touches.length === 1 && isPanning) {
    const wrap = getWrap();
    wrap.scrollLeft = scrollStartX - (e.touches[0].clientX - panStartX);
    wrap.scrollTop  = scrollStartY - (e.touches[0].clientY - panStartY);
  }
}

function onTouchEnd() {
  isPanning     = false;
  lastTouchDist = null;
}

/* ── attach / detach events ── */
function attachImageEvents() {
  const wrap = getWrap();
  if (!wrap) return;
  wrap.addEventListener('wheel',      handleWheel,  { passive: false });
  wrap.addEventListener('mousedown',  onMouseDown);
  wrap.addEventListener('touchstart', onTouchStart, { passive: false });
  wrap.addEventListener('touchmove',  onTouchMove,  { passive: false });
  wrap.addEventListener('touchend',   onTouchEnd);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup',   onMouseUp);
}

/* ══════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════ */
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

function openLightbox(idx) {
  currentMap = idx;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
  // attach after the DOM is ready
  requestAnimationFrame(() => attachImageEvents());
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  resetZoom();
}

function renderLightbox() {
  const m = maps[currentMap];
  const img = getImg();

  // reset zoom & scroll before loading new image
  zoomLevel = 1;
  if (img) {
    img.style.transform = 'scale(1)';
    img.src = m.img;
  }
  if (getLabel()) getLabel().textContent = '100%';
  const wrap = getWrap();
  if (wrap) { wrap.scrollLeft = 0; wrap.scrollTop = 0; }

  document.getElementById('lb-num').textContent   = m.num;
  document.getElementById('lb-title').textContent = m.title;
  document.getElementById('lb-desc').textContent  = m.desc;

  document.getElementById('lb-features').innerHTML =
    m.features.map(f => `<li>${f}</li>`).join('');

  document.getElementById('lb-facts').innerHTML =
    m.facts.map(f => `
      <div class="lb-fact">
        <div class="lb-fact-key">${f.k}</div>
        <div class="lb-fact-val">${f.v}</div>
      </div>
    `).join('');

  document.getElementById('btn-prev').disabled = currentMap === 0;
  document.getElementById('btn-next').disabled = currentMap === maps.length - 1;
}

function navigateMap(dir) {
  const next = currentMap + dir;
  if (next >= 0 && next < maps.length) {
    currentMap = next;
    renderLightbox();
  }
}

/* ══════════════════════════════════════════════
   NAV / SCROLL
══════════════════════════════════════════════ */
function navScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

const sectionIds = ['maps','about','objectives','methodology','schedule','projection','references'];

function updateActiveTab() {
  let activeIdx = 0;
  sectionIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 130) activeIdx = i;
  });
  document.querySelectorAll('.nav-tab').forEach((tab, i) =>
    tab.classList.toggle('active', i === activeIdx));
}

/* ══════════════════════════════════════════════
   GLOBAL EVENTS
══════════════════════════════════════════════ */
// Close on backdrop
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

// Keyboard
document.addEventListener('keydown', function(e) {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') navigateMap(1);
  if (e.key === 'ArrowLeft')  navigateMap(-1);
  if (e.key === '+' || e.key === '=') zoomIn();
  if (e.key === '-')          zoomOut();
  if (e.key === '0')          resetZoom();
});

window.addEventListener('scroll', updateActiveTab, { passive: true });

/* ── INIT ── */
buildCards();
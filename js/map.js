// Initialize map with base configuration
const map = L.map('map', {
    zoomControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topright'
    }
}).setView([14.0906, -87.2054], 6);

// Add base layers
const baseLayers = {
    "Jawg Maps": L.tileLayer('https://tile.jawg.io/6ce62bcb-c195-4d31-a3ce-421b1d40f3bd/{z}/{x}/{y}{r}.png?access-token=xpGCLKVCsTyKo9B2QbcI9mKUWCpJdS4PEpT1rsVCeZoENPdujT3KjjiEe9YLIwCO', {}),
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }),
    "Dark Matter": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri'
    })
};

// Add default base layer
baseLayers["Jawg Maps"].addTo(map);

// Add layer control
const layerControl = L.control.layers(baseLayers, {}, {
    position: "topright",
    collapsed: true
}).addTo(map);

// Add zoom control
L.control.zoom({
    position: "topright"
}).addTo(map);

// Add locate control
L.control.locate({
    position: 'topright',
    strings: {
        title: "Show my location"
    }
}).addTo(map);

// Initialize cores
import { heatmapCore } from './core/HeatmapCore.js';
import { hexagonCore } from './core/HexagonCore.js';
import { dataLoader } from './dataLoader.js';
import { initMapBehaviors } from './behaviors.js';
import { initWFSBehavior } from './behaviors/wfsBehavior.js';

// Set map reference in cores
heatmapCore.map = map;
hexagonCore.setMap(map);

// Theme Management
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme;
    document.body.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
});

// Coordinates input functionality
const coordsSection = document.querySelector('.footer-section:nth-child(2)');
const coordInput = document.querySelector('.coord-input');

coordsSection.addEventListener('click', (e) => {
    if (!e.target.closest('.coord-input')) {
        coordInput.classList.toggle('active');
    }
});

// Go to coordinates functionality
document.getElementById('goToCoord').addEventListener('click', () => {
    const input = document.getElementById('coordInput').value;
    const coords = input.split(',').map(coord => parseFloat(coord.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        map.setView(coords, map.getZoom());
        coordInput.classList.remove('active');
    }
});

// Handle Enter key in coordinates input
document.getElementById('coordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('goToCoord').click();
    }
});

// Update info displays and handle zoom-based layer switching
function updateInfo(e) {
    // Update zoom level
    const zoom = map.getZoom();
    document.getElementById('currentZoom').textContent = zoom;
    
    // Update scale based on zoom level
    const scale = Math.round(zoom * 100000);
    document.getElementById('mapScale').textContent = `1:${scale}`;
    
    // Update coordinates if mouse event exists
    if (e && e.latlng) {
        const { lat, lng } = e.latlng;
        document.getElementById('currentCoords').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    // Update hexagon resolution based on zoom
    hexagonCore.adjustResolutionByZoom(zoom);

    // Switch base layer based on zoom level
    if (zoom >= 10) {
        if (!map.hasLayer(baseLayers["Satellite"])) {
            map.removeLayer(baseLayers["Jawg Maps"]);
            map.addLayer(baseLayers["Satellite"]);
        }
    } else {
        if (!map.hasLayer(baseLayers["Jawg Maps"])) {
            map.removeLayer(baseLayers["Satellite"]);
            map.addLayer(baseLayers["Jawg Maps"]);
        }
    }
}

// Map event listeners
map.on('zoomend', updateInfo);
map.on('mousemove', updateInfo);
map.on('moveend', updateInfo);

// Initialize data and behaviors
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando carga de datos...');
    dataLoader.loadPoints().then(() => {
        console.log('Datos cargados exitosamente');
        initMapBehaviors(map);
        initWFSBehavior(map);
    }).catch(error => {
        console.error('Error al cargar datos:', error);
    });
});

export { map };
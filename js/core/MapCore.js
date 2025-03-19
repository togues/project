import { mapConfig, baseLayers, controlsConfig } from '../config/mapConfig.js';

class MapCore {
    constructor() {
        this.map = null;
        this.layerControl = null;
        this.activeLayers = new Map();
        this.baseLayerInstances = {};
    }

    initialize(containerId) {
        if (this.map) {
            console.warn('Map already initialized');
            return this.map;
        }

        try {
            // Inicializar el mapa
            this.map = L.map(containerId, mapConfig);
            
            // Inicializar capas base
            this.initializeBaseLayers();
            
            // Inicializar controles
            this.initializeControls();
            
            // Configurar eventos base
            this.setupBaseEvents();

            return this.map;
        } catch (error) {
            console.error('Error initializing map:', error);
            throw error;
        }
    }

    initializeBaseLayers() {
        // Crear instancias de las capas base
        for (const [name, config] of Object.entries(baseLayers)) {
            const layer = L.tileLayer(config.url, config.options);
            this.baseLayerInstances[name] = layer;
        }

        // Añadir la primera capa (Jawg Maps) como default
        this.baseLayerInstances["Jawg Maps"].addTo(this.map);

        // Añadir control de capas
        this.layerControl = L.control.layers(this.baseLayerInstances, {}, {
            position: "topright",
            collapsed: true
        }).addTo(this.map);

        // Manejar cambio de capa base según el zoom
        this.map.on('zoomend', () => {
            const currentZoom = this.map.getZoom();
            
            if (currentZoom >= 9) {
                // Cambiar a Satellite si no está activo
                if (!this.map.hasLayer(this.baseLayerInstances["Satellite"])) {
                    this.map.removeLayer(this.baseLayerInstances["Jawg Maps"]);
                    this.map.addLayer(this.baseLayerInstances["Satellite"]);
                }
            } else {
                // Cambiar a Jawg Maps si no está activo
                if (!this.map.hasLayer(this.baseLayerInstances["Jawg Maps"])) {
                    this.map.removeLayer(this.baseLayerInstances["Satellite"]);
                    this.map.addLayer(this.baseLayerInstances["Jawg Maps"]);
                }
            }
        });
    }

    initializeControls() {
        // Zoom control
        L.control.zoom(controlsConfig.zoom).addTo(this.map);

        // Locate control
        L.control.locate(controlsConfig.locate).addTo(this.map);
    }

    setupBaseEvents() {
        const updateInfo = (e) => {
            // Actualizar zoom
            const zoom = this.map.getZoom();
            document.getElementById('currentZoom').textContent = zoom;
            
            // Actualizar escala
            const scale = Math.round(this.map.getZoom() * 100000);
            document.getElementById('mapScale').textContent = `1:${scale}`;
            
            // Actualizar coordenadas
            if (e && e.latlng) {
                const { lat, lng } = e.latlng;
                document.getElementById('currentCoords').textContent = 
                    `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
        };

        this.map.on('zoomend', updateInfo);
        this.map.on('mousemove', updateInfo);
        this.map.on('moveend', updateInfo);
    }

    getMap() {
        return this.map;
    }

    getLayerControl() {
        return this.layerControl;
    }
}

// Exportar una única instancia
export const mapCore = new MapCore();
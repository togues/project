import { dataLoader } from './dataLoader.js';

class MapBehaviors {
    constructor(map) {
        this.map = map;
        this.drawnItems = new L.FeatureGroup();
        this.setupDrawControl();
        this.setupClearFilterButton();
        this.isFiltering = false;
    }

    setupDrawControl() {
        this.map.addLayer(this.drawnItems);

        const drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                marker: false,
                circle: false,
                circlemarker: false,
                rectangle: {
                    shapeOptions: {
                        color: '#00A650',
                        weight: 2
                    }
                },
                polygon: {
                    shapeOptions: {
                        color: '#00A650',
                        weight: 2
                    }
                },
                polyline: false
            },
            edit: {
                featureGroup: this.drawnItems,
                remove: true
            }
        });

        this.map.addControl(drawControl);

        this.map.on(L.Draw.Event.CREATED, (event) => {
            const layer = event.layer;
            this.drawnItems.clearLayers();
            this.drawnItems.addLayer(layer);
            
            const geometry = layer.toGeoJSON().geometry;
            this.filterPoints(geometry);
        });

        this.map.on(L.Draw.Event.DELETED, () => {
            this.showAllPoints();
        });
    }

    setupClearFilterButton() {
        const ClearFilterControl = L.Control.extend({
            options: {
                position: 'topright'
            },

            onAdd: () => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', 'clear-filter-button', container);
                button.innerHTML = '×';
                button.href = '#';
                button.title = 'Limpiar Filtro';
                
                L.DomEvent.on(button, 'click', (e) => {
                    L.DomEvent.preventDefault(e);
                    this.showAllPoints();
                });

                return container;
            }
        });

        this.clearFilterControl = new ClearFilterControl();
        this.map.addControl(this.clearFilterControl);
    }

    filterPoints(geometry) {
        if (!geometry) return;

        try {
            this.isFiltering = true;
            console.log('Filtrando puntos dentro del polígono...');

            if (!dataLoader.points || !Array.isArray(dataLoader.points)) {
                console.warn('No hay puntos para filtrar');
                dataLoader.handlePoints([]);
                return;
            }

            const pointsData = {
                type: 'FeatureCollection',
                features: dataLoader.points
            };

            const pointsWithin = turf.pointsWithinPolygon(pointsData, geometry);
            
            if (!pointsWithin || !pointsWithin.features) {
                console.warn('No se encontraron puntos dentro del polígono');
                dataLoader.handlePoints([]);
                return;
            }

            console.log(`Encontrados ${pointsWithin.features.length} puntos dentro del polígono`);
            dataLoader.handlePoints(pointsWithin.features.map(f => f.properties));
        } catch (error) {
            console.error('Error al filtrar puntos:', error);
            this.showAllPoints();
        }
    }

    showAllPoints() {
        if (!this.isFiltering) return;

        console.log('Mostrando todos los puntos...');
        this.drawnItems.clearLayers();
        this.isFiltering = false;
        dataLoader.loadPoints();
    }
}

let mapBehaviorsInstance = null;

export function initMapBehaviors(map) {
    if (!mapBehaviorsInstance) {
        mapBehaviorsInstance = new MapBehaviors(map);
    }
    return mapBehaviorsInstance;
}
import { map } from './map.js';
import { PopupHandler } from './ui/PopupHandler.js';
import { heatmapCore } from './core/HeatmapCore.js';
import { hexagonCore } from './core/HexagonCore.js';
import { dataCore } from './core/DataCore.js';

class DataLoader {
    constructor() {
        this.pointsLayer = null;
        this.clusterLayer = null;
        this.points = [];
        this.visiblePointsCount = 0;
        this.setupToggles();
    }

    setupToggles() {
        // Heatmap toggle
        const heatmapToggle = document.getElementById('heatmapToggle');
        if (heatmapToggle) {
            heatmapToggle.addEventListener('click', () => {
                const isHeatmapVisible = heatmapCore.toggle();
                
                if (isHeatmapVisible) {
                    hexagonCore.hide();
                    if (this.clusterLayer) {
                        map.removeLayer(this.clusterLayer);
                    }
                } else if (!hexagonCore.isVisible) {
                    if (this.clusterLayer) {
                        map.addLayer(this.clusterLayer);
                    }
                }

                heatmapToggle.classList.toggle('active', isHeatmapVisible);
                document.getElementById('hexagonToggle')?.classList.remove('active');
            });
        }

        // Hexagon toggle
        const hexagonToggle = document.getElementById('hexagonToggle');
        if (hexagonToggle) {
            hexagonToggle.addEventListener('click', () => {
                const isHexagonVisible = hexagonCore.toggle();
                
                if (isHexagonVisible) {
                    heatmapCore.hide();
                    if (this.clusterLayer) {
                        map.removeLayer(this.clusterLayer);
                    }
                } else if (!heatmapCore.isVisible) {
                    if (this.clusterLayer) {
                        map.addLayer(this.clusterLayer);
                    }
                }

                hexagonToggle.classList.toggle('active', isHexagonVisible);
                document.getElementById('heatmapToggle')?.classList.remove('active');
            });
        }
    }

    async loadPoints() {
        try {
            console.log('Fetching points data...');
            const response = await fetch('https://api.metrixmobile.xyz/api/incidencias');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (!result.data || !Array.isArray(result.data)) {
                throw new Error('Invalid API response format');
            }
            console.log('Data received:', result);
            this.handlePoints(result.data);
            
            // Update visualizations
            heatmapCore.setData(result.data);
            hexagonCore.setData(result.data);
        } catch (error) {
            console.error('Error loading points:', error);
            this.handlePoints([]);
        }
    }

    handlePoints(points) {
        if (!Array.isArray(points)) {
            console.error('Invalid data format:', points);
            points = [];
        }

        console.log(`Processing ${points.length} points...`);

        // Remove existing layers
        if (this.pointsLayer) {
            map.removeLayer(this.pointsLayer);
        }
        if (this.clusterLayer) {
            map.removeLayer(this.clusterLayer);
        }

        // Convert points to GeoJSON format
        const geojsonData = {
            type: 'FeatureCollection',
            features: points.map(point => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(point.longitud || 0),
                        parseFloat(point.latitud || 0)
                    ]
                },
                properties: point
            })).filter(feature => 
                !isNaN(feature.geometry.coordinates[0]) && 
                !isNaN(feature.geometry.coordinates[1])
            )
        };

        // Store points data and update count
        this.points = geojsonData.features;
        this.visiblePointsCount = this.points.length;
        this.updatePointsCounter();

        // Create cluster layer
        this.clusterLayer = L.markerClusterGroup({
            disableClusteringAtZoom: 13,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 50,
            iconCreateFunction: (cluster) => {
                const count = cluster.getChildCount();
                let size = 'small';
                
                if (count > 50) {
                    size = 'large';
                } else if (count > 20) {
                    size = 'medium';
                }
                
                return L.divIcon({
                    html: `<div><span>${count}</span></div>`,
                    className: `marker-cluster marker-cluster-${size}`,
                    iconSize: L.point(40, 40)
                });
            }
        });

        // Create points layer
        this.pointsLayer = L.geoJSON(geojsonData, {
            pointToLayer: (feature, latlng) => {
                const estado = feature.properties.estado;
                const colorSla = feature.properties.color_sla || '#ef4444';
                
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: colorSla,
                    color: '#ffffff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: estado === 'Abierto' ? 0.8 : 0.4
                });
            },
            onEachFeature: (feature, layer) => {
                const popupContent = PopupHandler.createPopupContent(feature.properties);
                layer.bindPopup(popupContent, {
                    maxWidth: 300,
                    maxHeight: 400,
                    autoPan: true,
                    closeButton: true,
                    autoPanPadding: [40, 40]
                });
            }
        });

        // Add points to cluster and map
        this.clusterLayer.addLayer(this.pointsLayer);
        map.addLayer(this.clusterLayer);
        
        console.log('Points layer added to map');
    }

    updatePointsCounter() {
        const counterElement = document.getElementById('pointsCounter');
        if (counterElement) {
            counterElement.textContent = this.visiblePointsCount;
        }
    }
}

// Create and export single instance
export const dataLoader = new DataLoader();

// Add custom styles for clusters
const style = document.createElement('style');
style.textContent = `
    .marker-cluster {
        background-clip: padding-box;
        border-radius: 20px;
        background-color: rgba(239, 68, 68, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        border: 2px solid white;
    }

    .marker-cluster div {
        width: 30px;
        height: 30px;
        margin-left: 5px;
        margin-top: 5px;
        text-align: center;
        border-radius: 15px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(239, 68, 68, 0.8);
    }

    .marker-cluster-small {
        background-color: rgba(239, 68, 68, 0.6);
    }

    .marker-cluster-medium {
        background-color: rgba(239, 68, 68, 0.7);
    }

    .marker-cluster-large {
        background-color: rgba(239, 68, 68, 0.8);
    }

    .control-btn.active {
        background-color: var(--primary-color);
        color: white;
    }
`;
document.head.appendChild(style);
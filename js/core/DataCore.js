import { apiConfig, clusterConfig, markerConfig } from '../config/apiConfig.js';
import { PopupHandler } from '../ui/PopupHandler.js';

class DataCore {
    constructor() {
        this.points = [];
        this.pointsLayer = null;
        this.clusterLayer = null;
        this.visiblePointsCount = 0;
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(`${apiConfig.baseUrl}${endpoint}`, apiConfig.defaultOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    validatePoint(point) {
        const requiredFields = ['latitud', 'longitud', 'estado', 'identificador'];
        return requiredFields.every(field => field in point) &&
               !isNaN(parseFloat(point.latitud)) &&
               !isNaN(parseFloat(point.longitud));
    }

    createClusterIcon(cluster) {
        const count = cluster.getChildCount();
        let size = count > 50 ? 'large' : count > 20 ? 'medium' : 'small';
        
        return L.divIcon({
            html: `<div><span>${count}</span></div>`,
            className: `marker-cluster marker-cluster-${size}`,
            iconSize: L.point(40, 40)
        });
    }

    createMarkerOptions(properties) {
        const estado = properties.estado.toLowerCase();
        const stateConfig = markerConfig.states[estado] || markerConfig.states.abierto;
        const colorSla = properties.color_sla || stateConfig.color;

        return {
            radius: markerConfig.radius,
            fillColor: colorSla,
            color: '#ffffff',
            weight: markerConfig.weight,
            opacity: markerConfig.opacity,
            fillOpacity: stateConfig.fillOpacity
        };
    }

    createGeoJSON(points) {
        return {
            type: 'FeatureCollection',
            features: points
                .filter(this.validatePoint)
                .map(point => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            parseFloat(point.longitud),
                            parseFloat(point.latitud)
                        ]
                    },
                    properties: point
                }))
        };
    }

    createClusterLayer() {
        return L.markerClusterGroup({
            ...clusterConfig,
            iconCreateFunction: this.createClusterIcon
        });
    }

    updatePointsCounter() {
        const counterElement = document.getElementById('pointsCounter');
        if (counterElement) {
            counterElement.textContent = this.visiblePointsCount;
        }
    }

    handleError(error, fallbackData = []) {
        console.error('Error in data handling:', error);
        return fallbackData;
    }
}

// Exportar una única instancia
export const dataCore = new DataCore();
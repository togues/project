class HeatmapCore {
    constructor(map) {
        this.map = map;
        this.heatmapLayer = null;
        this.points = [];
        this.isVisible = false;
        this.intensity = 1.0; // Aumentado de 0.6 a 1.0 para mayor intensidad
        this.radius = 30; // Aumentado de 25 a 30 para mejor visualización
        this.blur = 20; // Aumentado de 15 a 20 para suavizar transiciones
        this.maxZoom = 15;
    }

    setData(points) {
        this.points = points.map(point => {
            const lat = parseFloat(point.latitud);
            const lng = parseFloat(point.longitud);
            // Intensidad aumentada para puntos más prominentes
            return [lat, lng, this.intensity];
        }).filter(point => !isNaN(point[0]) && !isNaN(point[1]));
    }

    show() {
        try {
            if (!this.heatmapLayer) {
                this.heatmapLayer = L.heatLayer(this.points, {
                    radius: this.radius,
                    blur: this.blur,
                    maxZoom: this.maxZoom,
                    gradient: {
                        0.2: '#3388ff', // Azul más tenue para baja densidad
                        0.4: '#00A650', // Verde para densidad media-baja
                        0.6: '#ffb300', // Naranja para densidad media-alta
                        0.8: '#ff3d00', // Naranja-rojo para alta densidad
                        1.0: '#d50000'  // Rojo intenso para máxima densidad
                    },
                    minOpacity: 0.3 // Opacidad mínima para mejor visibilidad
                });
            }
            this.map.addLayer(this.heatmapLayer);
            this.isVisible = true;
        } catch (error) {
            console.error('Error showing heatmap:', error);
        }
    }

    hide() {
        try {
            if (this.heatmapLayer) {
                this.map.removeLayer(this.heatmapLayer);
            }
            this.isVisible = false;
        } catch (error) {
            console.error('Error hiding heatmap:', error);
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
        return this.isVisible;
    }

    updateData(points) {
        this.setData(points);
        if (this.isVisible && this.heatmapLayer) {
            this.heatmapLayer.setLatLngs(this.points);
        }
    }

    setOptions(options = {}) {
        const { intensity, radius, blur, maxZoom } = options;
        
        if (intensity !== undefined) this.intensity = intensity;
        if (radius !== undefined) this.radius = radius;
        if (blur !== undefined) this.blur = blur;
        if (maxZoom !== undefined) this.maxZoom = maxZoom;

        // Recreate heatmap layer with new options if it exists
        if (this.heatmapLayer && this.isVisible) {
            this.hide();
            this.show();
        }
    }
}

export const heatmapCore = new HeatmapCore();
class HexagonCore {
    constructor() {
        this.map = null;
        this.hexLayer = null;
        this.points = [];
        this.isVisible = false;
        this.resolution = 6;
        this.hexagons = new Map();
        this.colorScale = [
            '#ff0000',  // Rojo intenso para alta densidad
            '#ff3300',
            '#ff6600',
            '#ff9900',
            '#ffcc00',
            '#ffff00'   // Amarillo para baja densidad
        ];
    }

    setMap(map) {
        this.map = map;
    }

    setData(points) {
        this.points = points.filter(point => {
            const lat = parseFloat(point.latitud);
            const lng = parseFloat(point.longitud);
            return !isNaN(lat) && !isNaN(lng);
        });
        this.processHexagons();
    }

    processHexagons() {
        this.hexagons.clear();
        
        this.points.forEach(point => {
            const lat = parseFloat(point.latitud);
            const lng = parseFloat(point.longitud);
            const hexId = window.h3.latLngToCell(lat, lng, this.resolution);
            
            if (!this.hexagons.has(hexId)) {
                this.hexagons.set(hexId, { count: 0, points: [] });
            }
            
            const hexInfo = this.hexagons.get(hexId);
            hexInfo.count++;
            hexInfo.points.push(point);
        });
    }

    getHexagonStyle(count) {
        const maxCount = Math.max(...Array.from(this.hexagons.values()).map(h => h.count));
        const normalizedCount = count / maxCount;
        const colorIndex = Math.floor(normalizedCount * (this.colorScale.length - 1));
        const color = this.colorScale[colorIndex];
        
        return {
            fillColor: color,
            fillOpacity: 0.7, // Mayor opacidad para mejor visibilidad
            color: '#ffffff',
            weight: 1,
            opacity: 0.8
        };
    }

    show() {
        if (!this.map || this.isVisible) return;

        const hexFeatures = [];
        
        this.hexagons.forEach((info, hexId) => {
            const coordinates = window.h3.cellToBoundary(hexId, true);
            const feature = {
                type: 'Feature',
                properties: {
                    hexId,
                    count: info.count,
                    points: info.points
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [coordinates]
                }
            };
            hexFeatures.push(feature);
        });

        this.hexLayer = L.geoJSON({
            type: 'FeatureCollection',
            features: hexFeatures
        }, {
            style: (feature) => this.getHexagonStyle(feature.properties.count),
            onEachFeature: (feature, layer) => {
                const count = feature.properties.count;
                layer.bindPopup(`
                    <div class="p-3">
                        <h3 class="text-lg font-semibold mb-2">Densidad de Incidencias</h3>
                        <p class="text-sm font-medium">Total: ${count} incidencia${count !== 1 ? 's' : ''}</p>
                    </div>
                `);

                layer.on('mouseover', () => {
                    layer.setStyle({
                        fillOpacity: 0.9,
                        weight: 2,
                        opacity: 1
                    });
                });

                layer.on('mouseout', () => {
                    layer.setStyle(this.getHexagonStyle(count));
                });
            }
        }).addTo(this.map);

        this.isVisible = true;
    }

    hide() {
        if (this.hexLayer && this.map) {
            this.map.removeLayer(this.hexLayer);
            this.hexLayer = null;
        }
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
        return this.isVisible;
    }

    setResolution(resolution) {
        if (resolution >= 4 && resolution <= 8) {
            this.resolution = resolution;
            this.processHexagons();
            if (this.isVisible) {
                this.hide();
                this.show();
            }
        }
    }

    adjustResolutionByZoom(zoom) {
        let newResolution;
        if (zoom <= 6) newResolution = 4;
        else if (zoom <= 8) newResolution = 5;
        else if (zoom <= 10) newResolution = 6;
        else if (zoom <= 12) newResolution = 7;
        else newResolution = 8;

        if (this.resolution !== newResolution) {
            this.setResolution(newResolution);
        }
    }
}

export const hexagonCore = new HexagonCore();
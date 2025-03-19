import { wfsLayers } from './config/wfsConfig.js';
import { zoomBehaviors } from './config/zoomConfig.js';

class WFSLayerManager {
  constructor() {
    this.layers = new Map();
    this.map = null;
  }

  init(map) {
    this.map = map;
    this.setupZoomHandler();
  }

  setupZoomHandler() {
    if (!this.map) return;
    
    this.map.on('zoomend', () => {
      this.handleZoomChange(this.map.getZoom());
    });
  }

  handleZoomChange(currentZoom) {
    this.layers.forEach((layerInfo, layerId) => {
      const behavior = zoomBehaviors[layerId];
      if (!behavior) return;

      const { layer } = layerInfo;
      const { minZoom, maxZoom } = behavior;

      if (currentZoom < minZoom || currentZoom > maxZoom) {
        if (this.map.hasLayer(layer)) {
          this.map.removeLayer(layer);
        }
      } else {
        if (!this.map.hasLayer(layer)) {
          this.map.addLayer(layer);
        }

        const style = this.getZoomBasedStyle(currentZoom, layerId);
        layer.setStyle(style);
      }
    });
  }

  getZoomBasedStyle(zoom, layerId) {
    const baseStyle = wfsLayers.adminBoundaries.layers.find(l => l.id === layerId)?.style || {};
    
    if (zoom <= 6) {
      return {
        ...baseStyle,
        weight: 1,
        fillOpacity: 0.05
      };
    } else if (zoom >= 8) {
      return {
        ...baseStyle,
        weight: 2.5,
        fillOpacity: 0.15
      };
    }
    
    return baseStyle;
  }

  toggleLayer(layerId) {
    const layerInfo = this.layers.get(layerId);
    if (layerInfo) {
      const { layer } = layerInfo;
      if (this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
        return false;
      } else {
        this.map.addLayer(layer);
        return true;
      }
    }
    return false;
  }

  loadLayer(layerConfig) {
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    if (this.layers.has(layerConfig.id)) {
      console.log(`Layer ${layerConfig.id} already loaded`);
      return;
    }

    const jsonpCallback = `wfsCallback_${layerConfig.id}`;
    window[jsonpCallback] = (data) => {
      this.handleWFSData(data, layerConfig);
      delete window[jsonpCallback];
    };

    const script = document.createElement('script');
    script.src = `${layerConfig.url}?callback=${jsonpCallback}`;
    document.body.appendChild(script);
  }

  handleWFSData(data, layerConfig) {
    if (!data || !data.features) {
      console.error(`Invalid WFS data for layer ${layerConfig.id}`);
      return;
    }

    const layer = L.geoJSON(data, {
      style: layerConfig.style,
      interactive: true,
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          layer.bindPopup(this.createPopupContent(feature.properties));
        }
        
        layer.on('mouseover', (e) => {
          e.target.setStyle({
            color: '#00A650',
            weight: 3,
            fillOpacity: 0.2
          });
        });
        
        layer.on('mouseout', (e) => {
          e.target.setStyle(layerConfig.style);
        });
        
        layer.on('click', (e) => {
          this.layers.forEach((info) => {
            info.layer.eachLayer(l => {
              l.setStyle(info.config.style);
            });
          });
          
          e.target.setStyle({
            color: '#00A650',
            weight: 3,
            fillOpacity: 0.3
          });
        });
      }
    });

    this.layers.set(layerConfig.id, {
      layer,
      config: layerConfig
    });

    // Apply initial zoom behavior
    const currentZoom = this.map.getZoom();
    const behavior = zoomBehaviors[layerConfig.id];
    
    if (behavior && currentZoom >= behavior.minZoom && currentZoom <= behavior.maxZoom) {
      layer.addTo(this.map);
      const style = this.getZoomBasedStyle(currentZoom, layerConfig.id);
      layer.setStyle(style);
    }
  }

  createPopupContent(properties) {
    return `
      <div class="p-4">
        <h3 class="text-lg font-semibold">${properties.nombre || 'Sin nombre'}</h3>
      </div>
    `;
  }

  loadAllLayers() {
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    Object.values(wfsLayers).forEach(category => {
      category.layers.forEach(layer => {
        this.loadLayer(layer);
      });
    });
  }
}

export const wfsLayerManager = new WFSLayerManager();
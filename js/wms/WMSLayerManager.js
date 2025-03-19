import { map } from '../map.js';
import { wmsLayers } from './config/layerConfig.js';

class WMSLayerManager {
  constructor() {
    this.activeLayers = new Map();
    this.layerOrder = [];
  }

  addLayer(layerConfig) {
    if (this.activeLayers.has(layerConfig.id)) {
      return;
    }

    const wmsLayer = L.tileLayer.wms(layerConfig.url, {
      layers: layerConfig.layer,
      transparent: true,
      format: 'image/png',
      opacity: 1,
      zIndex: 1000 + this.layerOrder.length
    });

    wmsLayer.on('loading', () => {
      console.log(`Loading layer: ${layerConfig.name}`);
    });

    wmsLayer.on('load', () => {
      console.log(`Layer loaded: ${layerConfig.name}`);
    });

    wmsLayer.addTo(map);
    this.activeLayers.set(layerConfig.id, {
      layer: wmsLayer,
      config: layerConfig
    });
    this.layerOrder.push(layerConfig.id);
    this.updateZIndexes();
  }

  removeLayer(layerId) {
    const layerInfo = this.activeLayers.get(layerId);
    if (layerInfo) {
      map.removeLayer(layerInfo.layer);
      this.activeLayers.delete(layerId);
      this.layerOrder = this.layerOrder.filter(id => id !== layerId);
      this.updateZIndexes();
    }
  }

  toggleLayer(layerId) {
    const layerInfo = this.activeLayers.get(layerId);
    if (layerInfo) {
      this.removeLayer(layerId);
      return false;
    } else {
      const config = this.findLayerConfig(layerId);
      if (config) {
        this.addLayer(config);
        return true;
      }
    }
    return false;
  }

  setLayerOpacity(layerId, opacity) {
    const layerInfo = this.activeLayers.get(layerId);
    if (layerInfo) {
      layerInfo.layer.setOpacity(opacity);
    }
  }

  moveLayer(layerId, direction) {
    const currentIndex = this.layerOrder.indexOf(layerId);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex > 0) {
      [this.layerOrder[currentIndex], this.layerOrder[currentIndex - 1]] = 
      [this.layerOrder[currentIndex - 1], this.layerOrder[currentIndex]];
    } else if (direction === 'down' && currentIndex < this.layerOrder.length - 1) {
      [this.layerOrder[currentIndex], this.layerOrder[currentIndex + 1]] = 
      [this.layerOrder[currentIndex + 1], this.layerOrder[currentIndex]];
    }

    this.updateZIndexes();
  }

  updateZIndexes() {
    this.layerOrder.forEach((layerId, index) => {
      const layerInfo = this.activeLayers.get(layerId);
      if (layerInfo) {
        layerInfo.layer.setZIndex(1000 + this.layerOrder.length - index);
      }
    });
  }

  findLayerConfig(layerId) {
    for (const category of Object.values(wmsLayers)) {
      const layer = category.layers.find(l => l.id === layerId);
      if (layer) return layer;
    }
    return null;
  }

  getActiveLayers() {
    return Array.from(this.activeLayers.values()).map(info => ({
      id: info.config.id,
      name: info.config.name,
      opacity: info.layer.options.opacity
    }));
  }
}

export const wmsLayerManager = new WMSLayerManager();
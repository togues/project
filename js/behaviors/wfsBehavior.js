import { wfsLayerManager } from '../wfs/WFSLayerManager.js';

class WFSBehavior {
  constructor(map) {
    this.map = map;
    this.initialize();
  }

  initialize() {
    console.log('Initializing WFS layers...');
    wfsLayerManager.init(this.map);
    wfsLayerManager.loadAllLayers();
  }
}

let wfsBehaviorInstance = null;

export function initWFSBehavior(map) {
  if (!wfsBehaviorInstance) {
    wfsBehaviorInstance = new WFSBehavior(map);
  }
  return wfsBehaviorInstance;
}
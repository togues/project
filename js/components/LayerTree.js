import { wmsLayers } from '../wms/config/layerConfig.js';
import { wfsLayers } from '../wfs/config/wfsConfig.js';
import { wmsLayerManager } from '../wms/WMSLayerManager.js';
import { wfsLayerManager } from '../wfs/WFSLayerManager.js';
import { OpacityControl } from './OpacityControl.js';

export class LayerTree {
    constructor() {
        this.opacityControl = new OpacityControl();
        this.init();
    }

    init() {
        const layerTree = this.createLayerTree();
        const tab1Content = document.getElementById('tab1');
        const searchDiv = tab1Content.querySelector('.search-layers');
        
        if (searchDiv) {
            searchDiv.insertAdjacentElement('afterend', layerTree);
        } else {
            tab1Content.appendChild(layerTree);
        }
    }

    createLayerTree() {
        const layerTree = document.createElement('div');
        layerTree.className = 'layer-tree';

        // Add WFS layers first
        Object.entries(wfsLayers).forEach(([categoryKey, category]) => {
            layerTree.appendChild(this.createCategoryGroup(category, 'wfs'));
        });

        // Then add WMS layers
        Object.entries(wmsLayers).forEach(([categoryKey, category]) => {
            layerTree.appendChild(this.createCategoryGroup(category, 'wms'));
        });

        return layerTree;
    }

    createCategoryGroup(category, type) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'layer-group';
        
        const headerDiv = this.createCategoryHeader(category, type);
        const layersDiv = this.createLayersContainer(category, type);
        
        groupDiv.appendChild(headerDiv);
        groupDiv.appendChild(layersDiv);
        
        return groupDiv;
    }

    createCategoryHeader(category, type) {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'layer-group-header';
        headerDiv.innerHTML = `
            <i class="bi bi-caret-down-fill"></i>
            <span>${category.name}</span>
            <div class="layer-toggle">
                <input type="checkbox" title="Toggle all layers in this category">
            </div>
        `;

        // Add collapse/expand handler
        headerDiv.addEventListener('click', (e) => {
            if (!e.target.matches('input')) {
                headerDiv.classList.toggle('collapsed');
                const layersDiv = headerDiv.nextElementSibling;
                layersDiv.classList.toggle('collapsed');
                const icon = headerDiv.querySelector('i');
                icon.style.transform = headerDiv.classList.contains('collapsed') ? 'rotate(-90deg)' : '';
            }
        });

        // Add category checkbox handler
        const categoryCheckbox = headerDiv.querySelector('input[type="checkbox"]');
        categoryCheckbox.addEventListener('change', (e) => {
            const layersDiv = headerDiv.nextElementSibling;
            const layerCheckboxes = layersDiv.querySelectorAll('input[type="checkbox"]');
            layerCheckboxes.forEach(checkbox => {
                if (checkbox.checked !== e.target.checked) {
                    checkbox.checked = e.target.checked;
                    if (type === 'wms') {
                        wmsLayerManager.toggleLayer(checkbox.id);
                    } else {
                        wfsLayerManager.toggleLayer(checkbox.id);
                    }
                }
            });
        });

        return headerDiv;
    }

    createLayersContainer(category, type) {
        const layersDiv = document.createElement('div');
        layersDiv.className = 'layer-items';

        category.layers.forEach(layer => {
            const layerDiv = this.createLayerItem(layer, type);
            layersDiv.appendChild(layerDiv);
        });

        return layersDiv;
    }

    createLayerItem(layer, type) {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'layer-item';
        layerDiv.innerHTML = `
            <input type="checkbox" id="${layer.id}" title="Toggle ${layer.name}">
            <span>${layer.name}</span>
            <div class="layer-controls">
                <button class="layer-control-btn opacity-control" title="Adjust opacity">
                    <i class="bi bi-droplet-fill"></i>
                </button>
            </div>
        `;

        const checkbox = layerDiv.querySelector('input');
        checkbox.addEventListener('change', () => {
            if (type === 'wms') {
                wmsLayerManager.toggleLayer(layer.id);
            } else {
                wfsLayerManager.toggleLayer(layer.id);
            }
            this.updateCategoryCheckbox(layerDiv);
        });

        // Add opacity control
        const opacityBtn = layerDiv.querySelector('.opacity-control');
        opacityBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.opacityControl.toggle(layer.id, opacityBtn);
        });

        return layerDiv;
    }

    updateCategoryCheckbox(layerDiv) {
        const categoryDiv = layerDiv.closest('.layer-group');
        const categoryCheckbox = categoryDiv.querySelector('.layer-group-header input[type="checkbox"]');
        const layerCheckboxes = Array.from(categoryDiv.querySelectorAll('.layer-items input[type="checkbox"]'));
        const checkedCount = layerCheckboxes.filter(cb => cb.checked).length;
        
        categoryCheckbox.checked = checkedCount === layerCheckboxes.length;
        categoryCheckbox.indeterminate = checkedCount > 0 && checkedCount < layerCheckboxes.length;
    }
}
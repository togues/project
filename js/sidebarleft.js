import { map } from './map.js';
import { ModalManager } from './modals/modalManager.js';
import { LayerTree } from './components/LayerTree.js';

// Sidebar functionality
const sidebar = document.querySelector('.sidebar-left');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const mapContainer = document.getElementById('map');

// Toggle sidebar
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mapContainer.style.marginLeft = sidebar.classList.contains('active') ? '300px' : '0';
    map.invalidateSize();
});

// Tab functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Initialize layer tree
document.addEventListener('DOMContentLoaded', () => {
    new LayerTree();
});

// Modal Buttons Setup
const createModalButtons = () => {
    const buttonsHTML = `
        <div class="data-actions">
            <button id="openLayerFilters" class="sidebar-action-btn">
                <i class="bi bi-funnel-fill"></i>
                <span>Filtrar Capas</span>
            </button>
            <button id="openMediumModal" class="sidebar-action-btn">
                <i class="bi bi-window"></i>
                <span>Abrir Modal Mediano</span>
            </button>
            <button id="openLargeModal" class="sidebar-action-btn">
                <i class="bi bi-window-plus"></i>
                <span>Abrir Modal Grande</span>
            </button>
            <button id="openIframeModal" class="sidebar-action-btn">
                <i class="bi bi-graph-up"></i>
                <span>Dashboard ODS</span>
            </button>
        </div>
    `;
    
    const tab2Content = document.getElementById('tab2');
    if (tab2Content) {
        tab2Content.innerHTML = buttonsHTML;
    }
};

// Initialize modal buttons
createModalButtons();

// Modal event listeners
document.getElementById('openLayerFilters')?.addEventListener('click', () => {
    const layerFiltersModal = ModalManager.createModal('layerFilters', {
        size: 'md',
        title: 'Filtro de Capas',
        subtitle: 'Seleccione los filtros para las capas',
        onConfirm: () => console.log('Aplicando filtros...')
    });
    layerFiltersModal.open();
});

document.getElementById('openMediumModal')?.addEventListener('click', () => {
    const mediumModal = ModalManager.createModal('mediumDemo', {
        size: 'md',
        title: 'Modal Mediano',
        subtitle: 'Ejemplo de modal de tamaño mediano',
        onConfirm: () => console.log('Acción del modal mediano')
    });
    mediumModal.open();
});

document.getElementById('openLargeModal')?.addEventListener('click', () => {
    const largeModal = ModalManager.createModal('largeDemo', {
        size: 'lg',
        title: 'Modal Grande',
        subtitle: 'Ejemplo de modal de tamaño grande',
        onConfirm: () => console.log('Acción del modal grande')
    });
    largeModal.open();
});

document.getElementById('openIframeModal')?.addEventListener('click', () => {
    const iframeModal = ModalManager.createModal('iframeDemo', {
        size: 'xl',
        title: 'Dashboard ODS',
        subtitle: 'Indicadores ODS - SEDESOL',
        showFooter: false,
        onConfirm: () => console.log('Acción del modal iframe')
    });
    iframeModal.open();
});
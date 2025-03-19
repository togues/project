import { wmsLayerManager } from '../wms/WMSLayerManager.js';

export class OpacityControl {
    constructor() {
        this.activeSlider = null;
        this.setupGlobalClickHandler();
    }

    createSlider(layerId) {
        const slider = document.createElement('div');
        slider.className = 'opacity-slider';
        slider.innerHTML = `
            <input type="range" min="0" max="100" value="100" 
                   title="Adjust layer opacity">
        `;
        
        const input = slider.querySelector('input');
        input.addEventListener('input', (e) => {
            const opacity = parseInt(e.target.value) / 100;
            wmsLayerManager.setLayerOpacity(layerId, opacity);
        });
        
        return slider;
    }

    toggle(layerId, buttonElement) {
        // Si hay un slider activo y es el mismo que estamos intentando abrir, lo cerramos
        if (this.activeSlider && this.activeSlider.parentElement === buttonElement.parentElement) {
            this.activeSlider.remove();
            this.activeSlider = null;
            return;
        }

        // Removemos cualquier slider activo
        if (this.activeSlider) {
            this.activeSlider.remove();
            this.activeSlider = null;
        }

        // Creamos y posicionamos el nuevo slider
        const slider = this.createSlider(layerId);
        const controls = buttonElement.parentElement;
        controls.appendChild(slider);

        // Aseguramos que el slider esté visible
        requestAnimationFrame(() => {
            slider.classList.add('active');
            this.activeSlider = slider;
        });
    }

    setupGlobalClickHandler() {
        document.addEventListener('click', (e) => {
            if (this.activeSlider && 
                !e.target.closest('.opacity-slider') && 
                !e.target.closest('.opacity-control')) {
                this.activeSlider.remove();
                this.activeSlider = null;
            }
        });
    }
}
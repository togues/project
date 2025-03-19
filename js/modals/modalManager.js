import { Modal } from '../modal.js';
import { layerFiltersTemplate } from '../templates/modals/layerFilters.template.js';
import { 
    mediumModalTemplate, 
    largeModalTemplate,
    iframeModalTemplate 
} from '../templates/modals/demoModals.template.js';

export class ModalManager {
    static templates = {
        layerFilters: layerFiltersTemplate,
        mediumDemo: mediumModalTemplate,
        largeDemo: largeModalTemplate,
        iframeDemo: iframeModalTemplate
    };

    static createModal(type, options = {}) {
        const template = this.templates[type];
        if (!template) {
            throw new Error(`Template ${type} not found`);
        }

        return new Modal({
            content: template(),
            ...options
        });
    }
}
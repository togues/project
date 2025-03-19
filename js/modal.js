class Modal {
    constructor(options = {}) {
        this.options = {
            size: 'md',
            title: '',
            subtitle: '',
            content: '',
            onClose: null,
            onConfirm: null,
            showFooter: false,
            showHeader: true,
            ...options
        };
        
        this.create();
        this.setupEventListeners();
    }

    getModalSize() {
        const sizes = {
            sm: 'max-w-lg',
            md: 'max-w-2xl',
            lg: 'max-w-4xl',
            xl: 'max-w-6xl'
        };
        return sizes[this.options.size] || sizes.md;
    }

    create() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-10 z-[2000] hidden';
        
        let headerHTML = this.options.showHeader ? `
            <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">${this.options.title}</h2>
                    ${this.options.subtitle ? `<div class="text-sm text-emerald-600 font-mono mt-1">${this.options.subtitle}</div>` : ''}
                </div>
                <button class="text-3xl text-gray-400 hover:text-gray-600 transition-colors">×</button>
            </div>
        ` : '';

        let footerHTML = this.options.showFooter ? `
            <div class="border-t border-gray-100 p-4 bg-white dark:bg-gray-800">
                <div class="flex justify-end">
                    <button class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        ` : '';

        const modalHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl ${this.getModalSize()} w-full mx-4 overflow-hidden">
                ${headerHTML}
                <div class="overflow-y-auto max-h-[calc(90vh-8rem)]">
                    ${this.options.content}
                </div>
                ${footerHTML}
            </div>
        `;
        
        this.overlay.innerHTML = modalHTML;
        document.body.appendChild(this.overlay);
    }

    setupEventListeners() {
        const closeBtn = this.overlay.querySelector('button');
        const confirmBtn = this.overlay.querySelector('.bg-emerald-600');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.close());
        }

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
    }

    open() {
        this.overlay.classList.remove('hidden');
    }

    close() {
        this.overlay.classList.add('hidden');
        setTimeout(() => this.destroy(), 200);
        if (this.options.onClose) this.options.onClose();
    }

    destroy() {
        this.overlay.remove();
    }
}

// Global function to show incident details
window.showIncidentDetails = (properties) => {
    const creationDate = new Date(properties.fecha_creacion).toLocaleString();
    const dueDate = properties.fecha_vencimiento ? 
        new Date(properties.fecha_vencimiento).toLocaleString() : 'No establecida';

    const modal = new Modal({
        size: 'md',
        title: 'Información del Ticket',
        subtitle: `#${properties.identificador}`,
        content: `
            <div class="p-6 space-y-8">
                <!-- Información General -->
                <div>
                    <h3 class="text-lg font-medium text-emerald-700 mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Información General
                    </h3>
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <div class="text-sm text-gray-500 mb-1">Estado</div>
                            <span class="px-3 py-1 inline-flex text-sm font-medium rounded-full
                                ${properties.estado.toLowerCase() === 'abierto' 
                                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}">
                                ${properties.estado}
                            </span>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500 mb-1">Prioridad</div>
                            <span class="px-3 py-1 inline-flex text-sm font-medium rounded-full
                                ${properties.prioridad === 'Alto' 
                                    ? 'bg-red-50 text-red-800 border border-red-200' 
                                    : properties.prioridad === 'Medio'
                                        ? 'bg-orange-50 text-orange-800 border border-orange-200'
                                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}">
                                ${properties.prioridad}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Fechas -->
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <div class="flex items-center gap-1 text-gray-500 mb-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Fecha de Creación
                        </div>
                        <div class="text-sm font-medium">${creationDate}</div>
                    </div>
                    <div>
                        <div class="flex items-center gap-1 text-gray-500 mb-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Fecha de Vencimiento
                        </div>
                        <div class="text-sm font-medium ${dueDate === 'No establecida' ? 'text-gray-400' : ''}">${dueDate}</div>
                    </div>
                </div>

                <!-- Detalles -->
                <div>
                    <h3 class="text-lg font-medium text-emerald-700 mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Detalles
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <div class="text-sm text-gray-500 mb-1">Cliente</div>
                            <div class="font-medium">${properties.nombre_cliente}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500 mb-1">Área</div>
                            <div class="font-medium">${properties.nombre_area}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500 mb-1">Título</div>
                            <div class="font-medium">${properties.titulo}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500 mb-1">Descripción</div>
                            <div class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                ${properties.descripcion}
                            </div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500 mb-1">Ubicación</div>
                            <div class="text-sm text-gray-600">
                                ${properties.direccion_completa}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    });

    modal.open();
};

export { Modal };
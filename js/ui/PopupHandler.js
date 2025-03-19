import { priorityConfig } from '../config/apiConfig.js';

export class PopupHandler {
    static createPopupContent(properties) {
        const creationDate = new Date(properties.fecha_creacion).toLocaleString();
        const dueDate = properties.fecha_vencimiento ? 
            new Date(properties.fecha_vencimiento).toLocaleString() : 'No establecida';

        const getStatusClass = (status) => {
            const statusMap = {
                'abierto': 'bg-yellow-100 text-yellow-800',
                'en proceso': 'bg-blue-100 text-blue-800',
                'cerrado': 'bg-green-100 text-green-800'
            };
            return statusMap[status.toLowerCase()] || statusMap.abierto;
        };

        const getPriorityClass = (priority) => {
            return priorityConfig[priority.toLowerCase()]?.class || priorityConfig.media.class;
        };

        return `
            <div class="p-4 min-w-[300px]">
                <div class="flex justify-between items-center mb-3">
                    <span class="font-mono text-gray-600 text-sm">#${properties.identificador}</span>
                    <div class="flex gap-2">
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(properties.prioridad)}">
                            ${properties.prioridad}
                        </span>
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(properties.estado)}">
                            ${properties.estado}
                        </span>
                    </div>
                </div>
                
                <h3 class="text-lg font-semibold text-primary mb-4">${properties.titulo}</h3>
                
                <div class="space-y-2 mb-4">
                    <div class="flex">
                        <span class="w-24 text-sm text-gray-500">Creado:</span>
                        <span class="text-sm">${creationDate}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-sm text-gray-500">Vence:</span>
                        <span class="text-sm">${dueDate}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-sm text-gray-500">Cliente:</span>
                        <span class="text-sm">${properties.nombre_cliente}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-sm text-gray-500">Área:</span>
                        <span class="text-sm">${properties.nombre_area}</span>
                    </div>
                    <div class="flex">
                        <span class="w-24 text-sm text-gray-500">Ubicación:</span>
                        <span class="text-sm">${properties.direccion_completa}</span>
                    </div>
                </div>

                <button onclick="window.showIncidentDetails(${JSON.stringify(properties).replace(/"/g, '&quot;')})"
                        class="w-full py-2 px-4 bg-primary hover:bg-secondary text-white rounded-lg transition-colors duration-200 font-medium text-sm">
                    Ver Detalles
                </button>
            </div>
        `;
    }
}
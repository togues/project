// Configuración de la API
export const apiConfig = {
    baseUrl: 'https://api.metrixmobile.xyz/api',
    endpoints: {
        incidents: '/incidencias'
    },
    defaultOptions: {
        headers: {
            'Content-Type': 'application/json'
        }
    }
};

// Configuración de clustering
export const clusterConfig = {
    disableClusteringAtZoom: 13,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 50
};

// Configuración de marcadores
export const markerConfig = {
    radius: 8,
    weight: 1,
    opacity: 1,
    defaultColor: '#ef4444',
    states: {
        abierto: {
            fillOpacity: 0.8,
            color: '#FFA500'
        },
        'en proceso': {
            fillOpacity: 0.6,
            color: '#3B82F6'
        },
        cerrado: {
            fillOpacity: 0.4,
            color: '#10B981'
        }
    }
};

// Configuración de prioridades
export const priorityConfig = {
    alta: {
        class: 'bg-red-100 text-red-800',
        icon: 'bi-exclamation-triangle-fill'
    },
    media: {
        class: 'bg-yellow-100 text-yellow-800',
        icon: 'bi-exclamation-circle-fill'
    },
    baja: {
        class: 'bg-green-100 text-green-800',
        icon: 'bi-info-circle-fill'
    }
};
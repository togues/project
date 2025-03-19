// Configuración base del mapa
export const mapConfig = {
    center: [14.0906, -87.2054],
    zoom: 6,
    zoomControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topright'
    }
};

// Configuración de capas base
export const baseLayers = {
    "Jawg Maps": {
        url: 'https://tile.jawg.io/6ce62bcb-c195-4d31-a3ce-421b1d40f3bd/{z}/{x}/{y}{r}.png?access-token=xpGCLKVCsTyKo9B2QbcI9mKUWCpJdS4PEpT1rsVCeZoENPdujT3KjjiEe9YLIwCO',
        options: {}
    },
    "OpenStreetMap": {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
            attribution: '© OpenStreetMap contributors'
        }
    },
    "Dark Matter": {
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        options: {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }
    },
    "Satellite": {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
            attribution: 'Esri'
        }
    }
};

// Configuración de controles
export const controlsConfig = {
    zoom: {
        position: "topright"
    },
    locate: {
        position: 'topright',
        strings: {
            title: "Show my location"
        }
    }
};
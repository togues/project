export const wfsLayers = {
  adminBoundaries: {
    name: 'Límites Administrativos',
    layers: [
      {
        id: 'limite_mxestados',
        url: 'https://espacialhn.com/slim4/api/api/sinit/limite_mxestados/',
        name: 'Estados de México',
        style: {
          color: '#3388ff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.1
        }
      }
    ]
  },
  incidents: {
    name: 'Incidencias',
    layers: [
      {
        id: 'incidencias',
        url: 'https://api.metrixmobile.xyz/api/incidencias',
        name: 'Incidencias',
        style: {
          radius: 8,
          fillColor: '#ef4444',
          color: '#ffffff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }
      }
    ]
  }
};
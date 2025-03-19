export const wmsLayers = {
  adminBoundaries: {
    name: 'Límites Administrativos',
    layers: [
      {
        id: 'mexico_entidad',
        url: 'http://62.72.0.169:8080/geoserver/mapas/wms',
        layer: 'mapas:ENTIDAD',
        name: 'Entidad'
      },
      {
        id: 'mexico_distrito',
        url: 'http://62.72.0.169:8080/geoserver/mapas/wms',
        layer: 'mapas:DISTRITO_LOCAL',
        name: 'Distrito Local'
      }
    ]
  },
  riskManagement: {
    name: 'Gestión de Riesgo',
    layers: [
      {
        id: 'fao_asi',
        url: 'https://io.apps.fao.org/geoserver/wms/ASIS/ASI_D/v1?version=1.3.0?',
        layer: 'ASI_D_2023-22_S2_P:ASIS:asis_asi_d_p',
        name: 'Índice Agrícola FAO'
      },
      {
        id: 'fao_sequia',
        url: 'https://io.apps.fao.org/geoserver/wms/ASIS/DI_D/v1?version=1.3.0?',
        layer: 'DI_D_2023-22_S2_P:ASIS:asis_di_d_p',
        name: 'Índice de Sequía'
      },
      {
        id: 'get_fao_saludvegetal',
        url: 'https://io.apps.fao.org/geoserver/wms/ASIS/VHI_D/v1?version=1.3.0?',
        layer: 'VHI_D_2023-22:ASIS:asis_vhi_d',
        name: 'Salud Vegetal (VHI)'
      }
    ]
  },
  fires: {
    name: 'Incendios',
    layers: [
      {
        id: 'firm24',
        url: 'https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/3db158563c718465cc2b9049e36a37f2/fires_viirs_24/?REQUEST=GetMap&WIDTH=1024&HEIGHT=512&BBOX=-180,-90,180,90',
        layer: 'sumAL41EGE',
        name: 'Incendios Forestales 24h'
      },
      {
        id: 'firm48',
        url: 'https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/3db158563c718465cc2b9049e36a37f2/fires_modis_48/?REQUEST=GetMap&WIDTH=1024&HEIGHT=512&BBOX=-180,-90,180,90',
        layer: 'sumAL41EGE',
        name: 'Incendios Forestales 48h'
      }
    ]
  },
  floods: {
    name: 'Inundaciones',
    layers: [
      {
        id: 'EGE_probRgt50',
        url: 'https://ows.globalfloods.eu/glofas-ows/ows.py?',
        layer: 'EGE_probRgt50',
        name: 'Precipitación Prob. >50mm'
      },
      {
        id: 'ForecastSkill',
        url: 'https://ows.globalfloods.eu/glofas-ows/ows.py?',
        layer: 'ForecastSkill',
        name: 'Probabilidad de Inundación'
      }
    ]
  },
  climate: {
    name: 'Clima',
    layers: [
      {
        id: 'precipitation',
        url: 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_qpf6hrs_offsets/MapServer/WMSServer',
        layer: '6',
        name: 'Precipitación NOAA'
      }
    ]
  }
};
import { map } from './map.js';

// Add polyline measure control with custom options
L.control.polylineMeasure({
    position: 'topright',
    unit: 'metres',
    showBearings: true,
    clearMeasurementsOnStop: false,
    showClearControl: false,
    showUnitControl: false
}).addTo(map);
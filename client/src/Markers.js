import L from 'leaflet';

const amenityMarkers = {
  hospital: {
    html: '<i class="fas fa-ambulance" style="color: red;"></i>',
    className: 'a'
  },
  police: {
    html: '<i class="fas fa-crosshairs" style="color: black"></i>',
    className: 'a'
  },
  school: {
    html: '<i class="fas fa-graduation-cap" style="color: purple;"></i>',
    className: 'a'
  },
  kindergarten: {
    html: '<i class="fas fa-kid" style="color: yellow"></i>',
    className: 'a'
  },
  default: {
    html: '<i class="fas fa-map-marker" style="color: blue"></i>',
    className: 'a'
  }
};

export const amenityMarkerFactory = amenity => {
  const div = amenityMarkers[amenity] || amenityMarkers['default'];
  console.log(div);
  return L.divIcon(div);
};

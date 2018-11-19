const BASE_API_URL = 'http://localhost:12345/';
const MAP_OPTIONS = {
  center: [48.13786, 17.11167],
  zoom: 14
};

const initializeBaseMap = () => {
  const map = L.map('mapid', MAP_OPTIONS);

  const url =
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW5kZXJzdG9ybSIsImEiOiJjam10cWRleGcwMnh4M3FtdzBhbWZyeDMzIn0.OZOn8H9bnxVjD438RoGamw';
  const tileLayerConf = {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken:
      'pk.eyJ1IjoiZW5kZXJzdG9ybSIsImEiOiJjam10cWRleGcwMnh4M3FtdzBhbWZyeDMzIn0.OZOn8H9bnxVjD438RoGamw'
  };

  const layer = new L.TileLayer(url, tileLayerConf);

  map.addLayer(layer);

  return map;
};

const addMouseMoveEvent = map => {
  const onMouseMove = event => {
    const lng = L.Util.formatNum(event.latlng.lng, 5);
    const lat = L.Util.formatNum(event.latlng.lat, 5);
    const value = lat + ', ' + lng;
    console.log(value);
  };

  map.on('click', onMouseMove);
};

const drawPubs = async map => {
  const apiUrl = BASE_API_URL + 'puby';

  const result = await fetch(apiUrl).then(res => res.json());

  const style = {
    style: { color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: 100 }
  };
  const opts = {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.name);
    }
  };
  L.geoJSON(result.result[0].json_build_object, opts).addTo(map);
};

const drawRails = async map => {
  const api = BASE_API_URL + 'rails';

  const result = await fetch(api).then(res => res.json());

  L.geoJSON(result.result[0].json_build_object, { style: { color: 'black', weight: 1 }}).addTo(map);
}

const main = async () => {
  const map = initializeBaseMap();

  addMouseMoveEvent(map);

  await drawPubs(map);
  await drawRails(map);
};

main();

// const coords = [48.14012, 17.10491];
// var circle = L.circle(coords, {
//   color: 'red',
//   fillColor: '#f03',
//   fillOpacity: 0.5,
//   radius: 500
// }).addTo(map);

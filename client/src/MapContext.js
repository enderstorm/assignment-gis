import React from 'react';
import L from 'leaflet';

import { getBoundaries, getUbytovanie, near } from './api';
import { amenityMarkerFactory } from './Markers';

const MapContext = React.createContext();

export class MapProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      boundaries: [],
      selectedBoundaryId: null,
      boundaryLayer: null,
      ubytovanieLayer: null,
      near: [],
      nearLayer: null,
      interests: [],
      interestLayer: null
    };
  }

  setBoundary = boundaries => {
    this.state({ boundaries });
  };

  selectBoundary = id => async () => {
    this.clearInterests();

    const boundary = this.state.boundaries.find(b => b.id === id);
    if (this.state.boundaryLayer) {
      this.state.map.removeLayer(this.state.boundaryLayer);
    }
    const boundaryLayer = L.geoJSON(null, {
      style: {
        color: '#ff7800',
        weight: 3,
        opacity: 0.5,
        fillOpacity: 0.1,
        dashArray: '3'
      }
    }).addTo(this.state.map);
    boundaryLayer.addData(boundary);

    const latlon = new L.LatLng(
      boundary.properties.center.coordinates[1],
      boundary.properties.center.coordinates[0]
    );

    this.state.map.panTo(latlon);

    if (this.state.ubytovanieLayer) {
      this.state.map.removeLayer(this.state.ubytovanieLayer);
    }

    try {
      const ubytovanie = await getUbytovanie(id).then(res => res.json());
      const geojson = ubytovanie.result[0].json_build_object;

      const opts = {
        onEachFeature: this.onEachBuilding,
        style: {
          opacity: 0.2
        }
      };

      const ubytovanieLayer = L.geoJSON(null, opts).addTo(this.state.map);
      ubytovanieLayer.addData(geojson);

      this.setState({ selectedBoundaryId: id, boundaryLayer, ubytovanieLayer });
    } catch (e) {
      this.setState({ selectedBoundaryId: id, boundaryLayer });
      console.log(e);
    }
  };

  clearInterests = () => {
    if (this.state.interestLayer) {
      this.state.map.removeLayer(this.state.interestLayer);
    }

    this.setState({ interests: [], interestLayer: null });
  };

  addInterests = interests => {
    this.clearInterests();

    const opts = {
      pointToLayer: (feature, latlng) => {
        const amenity = feature.properties.amenity;

        const point = amenityMarkerFactory(amenity);

        return L.marker(latlng, { icon: point });
      }
    };

    const interestLayer = L.geoJSON(null, opts).addTo(this.state.map);
    interestLayer.addData(interests);

    this.setState({ interests, interestLayer });
    console.log(this.state);
  };

  onEachBuilding = (feature, layer) => {
    if (feature) {
      layer.on('click', async e => {
        try {
          const data = await near(feature.id).then(res => res.json());

          const interests = data.result[0].json_build_object;
          this.addInterests(interests);
        } catch (e) {
          console.error(e);
        }
      });
    }
  };

  markerFactory = ({ x, y, amenity }) => {};

  componentDidMount() {
    const MAP_OPTIONS = {
      center: [48.13786, 17.11167],
      zoom: 14,
      maxZoom: 20
    };

    const map = L.map('map', {
      center: MAP_OPTIONS.center,
      zoom: MAP_OPTIONS.zoom,
      layers: [
        L.tileLayer(
          'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW5kZXJzdG9ybSIsImEiOiJjam10cWRleGcwMnh4M3FtdzBhbWZyeDMzIn0.OZOn8H9bnxVjD438RoGamw',
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: MAP_OPTIONS.maxZoom,
            id: 'mapbox.streets',
            accessToken:
              'pk.eyJ1IjoiZW5kZXJzdG9ybSIsImEiOiJjam10cWRleGcwMnh4M3FtdzBhbWZyeDMzIn0.OZOn8H9bnxVjD438RoGamw'
          }
        )
      ]
    });

    this.setState({ map });

    getBoundaries()
      .then(res => res.json())
      .then(data => {
        const boundaries = data.result[0].json_build_object.features;
        this.setState({ boundaries });
      });
  }

  render() {
    const { children } = this.props;
    return (
      <MapContext.Provider
        value={{
          ...this.state,
          setBoundary: this.setBoundary,
          selectBoundary: this.selectBoundary
        }}
      >
        {children}
      </MapContext.Provider>
    );
  }
}

export const MapContextConsumer = MapContext.Consumer;

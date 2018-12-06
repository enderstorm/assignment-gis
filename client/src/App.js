import React, { Component } from 'react';

import './App.scss';

import { RightMenu } from './RightMenu';
import { MapProvider } from './MapContext';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="map" />
        <MapProvider>
          <RightMenu />
        </MapProvider>
      </div>
    );
  }
}

export default App;

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import { MapContextConsumer } from './MapContext';

const style = {
  width: 200,
  backgroundColor: 'white',
  position: 'fixed',
  top: 0,
  right: 0,
  zIndex: 100000,
  height: '100vh'
};

const distanceStyle = {
  width: 300,
  backgroundColor: 'white',
  position: 'fixed',
  top: 0,
  right: '200px',
  zIndex: 100000,
  height: '100vh',
  overflowY: 'scroll'
};

const MenuItemList = ({ id, text, onClick, active }) => (
  <li key={id}>
    <a onClick={onClick} className={active ? 'is-active' : ''}>
      {text}
    </a>
  </li>
);

const BoundariesList = () => (
  <MapContextConsumer>
    {({ boundaries, selectBoundary, selectedBoundaryId }) => (
      <ul className="menu-list">
        {boundaries &&
          boundaries.map(b =>
            MenuItemList({
              text: b.properties.name,
              id: b.id,
              onClick: selectBoundary(b.id),
              active: b.id === selectedBoundaryId
            })
          )}
      </ul>
    )}
  </MapContextConsumer>
);

const DistanceList = () => (
  <MapContextConsumer>
    {({ interests }) =>
      interests && interests.features && interests.features.length > 0 ? (
        <div style={distanceStyle}>
          <ul className="menu-list">
            {interests.features.map(i => (
              <li>
                <a>
                  {i.properties.name}
                  <br />
                  <small>{i.properties.amenity}</small>
                  <br />
                  <small>
                    <strong>{Number.parseInt(i.properties.distance)}</strong> metrov
                  </small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null
    }
  </MapContextConsumer>
);

export class RightMenu extends React.Component {
  render() {
    return (
      <div>
        <DistanceList />
        <div id="right-nav" style={style}>
          <div className="section">
            <div className="menu">
              <div className="menu-label">Výber lokality</div>
              <BoundariesList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

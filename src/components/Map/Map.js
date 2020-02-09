import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { HEADER_HEIGHT } from 'config';
import ReactMapGL from 'react-map-gl';
import { leftSelector, layersSelector } from 'selectors/map';
import MapPOIPopup from './MapPOIPopup';

class Component extends React.Component {
  state = {
    popupPt: null,
  };

  togglePopup(popupPt) {
    this.setState({ popupPt });
  }

  render() {
    const {
      left,
      viewport,
      setMapViewport,
      updateLayersData,
      layers,
    } = this.props;
    const { popupPt } = this.state;

    return (
      <div className="map" style={{ top: HEADER_HEIGHT, left }}>
        <ReactMapGL
          width="100%"
          height="100%"
          {...viewport}
          onViewportChange={viewport => {
            setMapViewport(viewport);
            if (this.map) {
              updateLayersData(
                this.map
                  .getMap()
                  .getBounds()
                  .toArray()
              );
            }
          }}
          onLoad={() => {
            if (this.map) {
              updateLayersData(
                this.map
                  .getMap()
                  .getBounds()
                  .toArray()
              );
            }
          }}
          ref={el => {
            if (el) this.map = el;
          }}
        >
          {layers.map(({ Component: LayerComponent, id: key, data }) => (
            <LayerComponent
              {...{ key, data }}
              showPopup={pt => this.togglePopup(pt)}
            />
          ))}

          <MapPOIPopup pt={popupPt} onClose={() => this.togglePopup(null)} />
        </ReactMapGL>
      </div>
    );
  }
}

export default connect(state => {
  const { map } = state;
  return { ...map, left: leftSelector(state), layers: layersSelector(state) };
}, mapDispatchToProps)(Component);

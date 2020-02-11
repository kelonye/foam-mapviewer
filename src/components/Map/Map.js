import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { HEADER_HEIGHT } from 'config';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { leftSelector, poisMapDataSelector } from 'selectors/map';
import MapPOIPopup from './MapPOIPopup';
import dataLayer from './data-layer';

function Component({
  left,
  viewport,
  data,
  setMapViewport,
  updateLayersData,
  isAddingPOI,
  showDrawer,
  setIsAddingPOI,
}) {
  const [popupPt, togglePopup] = React.useState(null);
  const [hoveredOnPOI, setHoveredOnPOI] = React.useState(false);
  const map = React.useRef();

  function getCursor(e) {
    if (isAddingPOI) return 'crosshair';
    if (hoveredOnPOI) return 'pointer';
    return 'grab';
  }

  function onLoad() {
    if (map.current) {
      updateLayersData(
        map.current
          .getMap()
          .getBounds()
          .toArray()
      );
    }
  }

  function onViewportChange({ latitude, longitude, zoom, bearing, pitch }) {
    setMapViewport({ latitude, longitude, zoom, bearing, pitch });
    if (map.current) {
      updateLayersData(
        map.current
          .getMap()
          .getBounds()
          .toArray()
      );
    }
  }

  function onHover(event) {
    const {
      features,
      // srcEvent: { offsetX, offsetY },
    } = event;
    const hoveredFeature =
      features && features.find(f => f.layer.id === 'pois');
    setHoveredOnPOI(!!hoveredFeature);
  }

  function onClick(event) {
    if (isAddingPOI) {
      const {
        lngLat: [lon, lat],
      } = event;
      showDrawer(`/add-poi/${lon}/${lat}`);
      setIsAddingPOI(false);
      return;
    }

    const {
      features,
      // srcEvent: { offsetX, offsetY },
    } = event;
    const clickedFeature =
      features && features.find(f => f.layer.id === 'pois');
    if (clickedFeature) {
      const { tags } = clickedFeature.properties;
      togglePopup({ ...clickedFeature.properties, tags: tags.split(',') });
    }
  }

  return (
    <div className="map" style={{ top: HEADER_HEIGHT, left }}>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={onViewportChange}
        onLoad={onLoad}
        getCursor={getCursor}
        ref={map}
        onHover={onHover}
        onClick={onClick}
      >
        <Source type="geojson" data={data}>
          <Layer {...dataLayer} />
        </Source>
        <MapPOIPopup pt={popupPt} onClose={() => togglePopup(null)} />
      </ReactMapGL>
    </div>
  );
}

export default connect(state => {
  const { isAddingPOI, viewport } = state.map;
  return {
    viewport,
    left: leftSelector(state),
    isAddingPOI,
    data: poisMapDataSelector(state),
  };
}, mapDispatchToProps)(Component);

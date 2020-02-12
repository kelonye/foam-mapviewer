import dataLayer from './data-layer';
import store from 'store';
import mapboxgl from 'mapbox-gl';
import { poisMapDataSelector } from 'selectors/map';
import { showDrawer, setIsAddingPOI } from 'actions';
import {
  ACTION_TYPE_UPDATE_LAYERS_DATA,
  LAYER_TYPE_POI,
  DEFAULT_LOCATION,
} from 'config';
import Geohash from 'latlon-geohash';
import xhr from 'utils/xhr';
import _ from 'lodash';
import cache from 'utils/cache';

const { REACT_APP_IS_DEV: IS_DEV } = process.env;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default new (class {
  constructor() {
    this.fetchLayersData = _.throttle(this.fetchLayersData, 2000);
  }

  render(container) {
    const { latitude, longitude, zoom, bearing, pitch } =
      cache('location') || DEFAULT_LOCATION;

    const map = (this.map = new mapboxgl.Map({
      container,
      style: this.getStyle(),
      center: [longitude, latitude],
      zoom,
      pitch,
      bearing,
    }));

    map.on('load', async() => {
      this.updatePOIs();
      map.on('move', e => this.onMove(e));
      map.on('mouseenter', 'pois', e => this.onMouseEnterPOIs(e));
      map.on('mouseleave', 'pois', e => this.onMouseLeavePOIs(e));
      map.on('click', 'pois', e => this.onClickPOIs(e));
      map.on('click', e => this.onClick(e));
    });
  }

  onMouseEnterPOIs(event) {
    const {
      map: { isAddingPOI },
    } = store.getState();
    if (isAddingPOI) {
      return;
    }

    this.updateCursor('pointer');
  }

  onMouseLeavePOIs(e) {
    const {
      map: { isAddingPOI },
    } = store.getState();
    if (isAddingPOI) {
      return;
    }

    this.updateCursor('');
  }

  onClickPOIs(event) {
    const {
      map: { isAddingPOI },
    } = store.getState();
    if (isAddingPOI) {
      return;
    }

    const {
      features: [pt],
    } = event;
    const { name, tags } = pt.properties;
    new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(pt.geometry.coordinates)
      .setHTML(
        `
      <div class="poi-popup flex flex--column">
        <div>${name}</div>
        <div>
          ${tags
            .split(',')
            .map(tag => `<span class="map-tag">${tag}</span>`)
            .join('')}
        </div>
      </div>
      `
      )
      .addTo(this.map);
  }

  onClick(event) {
    const {
      map: { isAddingPOI },
    } = store.getState();
    if (isAddingPOI) {
      const {
        lngLat: { lng, lat },
      } = event;
      store.dispatch(showDrawer(`/add-poi/${lng}/${lat}`));
      store.dispatch(setIsAddingPOI(false));
      return;
    }
  }

  onMove(e) {
    const { lng: longitude, lat: latitude } = this.map.getCenter();
    const zoom = this.map.getZoom();
    const bearing = this.map.getBearing();
    const pitch = this.map.getPitch();

    cache('location', { latitude, longitude, zoom, bearing, pitch });

    this.updatePOIs();
  }

  updateCursor(cursor) {
    this.map.getCanvas().style.cursor = cursor;
  }

  async updatePOIs() {
    await store.dispatch({
      type: ACTION_TYPE_UPDATE_LAYERS_DATA,
      payload: await this.fetchLayersData(),
    });
    this.updatePOIsData();
  }

  async updatePOIsData() {
    const data = poisMapDataSelector(store.getState());
    const poisSource = this.map.getSource('pois');
    if (!poisSource) {
      this.map.addSource('pois', {
        type: 'geojson',
        data,
      });
      this.map.addLayer(dataLayer);
      if (!window.location.pathname) store.dispatch(showDrawer('/layers'));
    } else {
      poisSource.setData(data);
    }
  }

  async fetchLayersData() {
    const [[swLng, swLat], [neLng, neLat]] = this.map.getBounds().toArray();

    const query = {
      neLat,
      neLng,
      swLat,
      swLng,
      limit: 101,
      offset: 0,
      sort: 'most_value',
      status: ['application', 'challenged', 'listing'],
    };

    const tags = {};
    let pois;
    try {
      const data = IS_DEV
        ? require('./data')
        : await xhr('get', '/poi/filtered', query);
      pois = data.map(
        ({
          geohash,
          name,
          tags: ptags,
          state: {
            status: { type: status },
          },
        }) => {
          ptags.forEach(tag => {
            tags[tag] = true;
          });
          return {
            name,
            status,
            tags: ptags,
            ...Geohash.decode(geohash),
          };
        }
      );
    } catch (e) {
      pois = [];
    }

    return [
      {
        type: LAYER_TYPE_POI,
        data: {
          pois,
          tags,
        },
      },
    ];
  }

  getStyle() {
    const {
      app: { theme },
    } = store.getState();

    return `mapbox://styles/mapbox/${theme}-v10`;
  }

  updateStyle() {
    this.map.setStyle(this.getStyle());
  }
})();

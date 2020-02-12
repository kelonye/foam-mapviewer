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
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom,
      pitch,
      bearing,
    }));

    map.on('load', async() => {
      this.updatePOIs();
      map.on('move', e => this.onMove(e));
      map.on('mouseenter', 'pois', e => this.onMouseEnter(e));
      map.on('mouseleave', 'pois', e => this.onMouseLeave(e));
      map.on('click', e => this.onClick(e));
    });
  }

  onMouseEnter(event) {
    const {
      map: { isAddingPOI },
    } = store.getState();
    if (isAddingPOI) {
      return;
    }

    const { features } = event;
    if (features && features.find(f => f.layer.id === 'pois')) {
      this.updateCursor('pointer');
    }
  }

  onMouseLeave(e) {
    const {
      map: { isAddingPOI },
    } = store.getState();
    if (isAddingPOI) {
      return;
    }

    this.updateCursor('');
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

    const { features } = event;
    const clickedFeature =
      features && features.find(f => f.layer.id === 'pois');
    if (event.features) {
      this.previewPOI(clickedFeature);
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

  previewPOI(pt) {
    const { name, tags } = pt.properties;
    new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(pt.geometry.coordinates)
      .setHTML(
        `
      <div class="flex flex--column">
        <div>${name}</div>
        <div>
          ${tags.split(',').map(tag => `<span class="map-tag">${tag}</span>`)}
        </div>
      </div>
      `
      )
      .addTo(this.map);
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
})();

import poisLayer from './pois-layer';
import store from 'utils/store';
import mapboxgl from 'mapbox-gl';
import { poisMapDataSelector } from 'selectors/map';
import { showDrawer, setIsAddingPOI, updateData } from 'actions';
import {
  ACTION_TYPE_UPDATE_DATA,
  DEFAULT_LOCATION,
  // IS_DEV,
  MAPBOX_ACCESS_TOKEN,
  SECONDARY_COLOR,
} from 'config';
import Geohash from 'latlon-geohash';
import xhr from 'utils/xhr';
import _ from 'lodash';
import cache from 'utils/cache';
import pinSVG from './pin';
import { deserializeFoam } from 'utils/foam';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const map = (window.map = new (class {
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
      this.onLoad();
      map.on('move', e => this.onMove(e));
      map.on('mouseenter', 'pois', e => this.onMouseEnterPOIs(e));
      map.on('mouseleave', 'pois', e => this.onMouseLeavePOIs(e));
      map.on('click', 'pois', e => this.onClickPOIs(e));
      map.on('click', e => this.onClick(e));
    });
  }

  onLoad() {
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      'bottom-right'
    );

    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    this.updatePOIs();
  }

  onMouseEnterPOIs(event) {
    const {
      map: { isAddingPOI },
    } = store.getState();
    if (isAddingPOI) {
      return;
    }

    this.updateCursor('pointer');

    if (this.hoverPopup) {
      this.hoverPopup.remove();
    }

    const {
      features: [pt],
    } = event;
    const { name, foam } = pt.properties;
    this.hoverPopup = new mapboxgl.Popup({ closeButton: false })
      .setLngLat(pt.geometry.coordinates)
      .setHTML(
        `
      <div class="poi-popup flex flex--column">
        <div>${name}</div>
        <div class="flex flex--shrink flex--justify-center">
          <div class="map-popup-foam flex flex--justify-center flex--align-center">
            ${foam} FOAM
          </div>
        </div>
      </div>
      `
      )
      .addTo(this.map);
  }

  onMouseLeavePOIs(e) {
    const {
      map: { isAddingPOI },
    } = store.getState();
    if (isAddingPOI) {
      return;
    }

    this.updateCursor('grab');

    // if (this.hoverPopup) {
    //   this.hoverPopup.remove();
    // }
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
    const { listingHash } = pt.properties;

    store.dispatch(showDrawer(`/poi/${listingHash}`));
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
      type: ACTION_TYPE_UPDATE_DATA,
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
      this.map.addLayer(poisLayer);
      if (!window.location.pathname) store.dispatch(showDrawer('/places'));
    } else {
      poisSource.setData(data);
    }
  }

  async fetchLayersData() {
    const [[swLng, swLat], [neLng, neLat]] = this.map.getBounds().toArray();

    store.dispatch(updateData({ isLoadingPlaces: true }));

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
    const poisByListingHash = {};
    const poisIds = [];
    try {
      // const data = IS_DEV
      //   ? require('data/sample-pois.json')
      //   : await xhr('get', '/poi/filtered', query);
      const data = await xhr('get', '/poi/filtered', query);
      data.forEach(
        ({
          listingHash,
          owner,
          geohash,
          name,
          tags: ptags,
          state: {
            status: { type: status },
            deposit,
          },
        }) => {
          ptags.forEach(tag => {
            tags[tag] = true;
          });
          const poi = {
            listingHash,
            owner,
            name,
            status,
            foam: deserializeFoam(deposit),
            tags: ptags,
            ...Geohash.decode(geohash),
          };
          poisIds.push(poi.listingHash);
          poisByListingHash[poi.listingHash] = poi;
        }
      );
    } catch (e) {
    } finally {
      store.dispatch(updateData({ isLoadingPlaces: false }));
    }

    return {
      poisIds,
      poisByListingHash,
      tags,
    };
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

  showPOIBeingApplied(coordinates) {
    this.removePOIBeingApplied();

    const el = document.createElement('div');
    el.className = 'marker';
    el.innerHTML = pinSVG({ size: 20, fill: SECONDARY_COLOR });

    this.poiBeingApplied = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(this.map);
  }

  removePOIBeingApplied() {
    if (this.poiBeingApplied) {
      this.poiBeingApplied.remove();
    }
  }
})());

export default map;

import poisLayer from './pois-layer';
import store from 'utils/store';
import mapboxgl from 'mapbox-gl';
import { poisInViewMapDataSelector } from 'selectors/map';
import * as actions from 'actions';
import { DEFAULT_LOCATION, MAPBOX_ACCESS_TOKEN, SECONDARY_COLOR } from 'config';
import _ from 'lodash';
import cache from 'utils/cache';
import pinSVG from './pin';

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
      map: {
        addPOI: { isAdding },
      },
    } = store.getState();
    if (isAdding) {
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
      map: {
        addPOI: { isAdding },
      },
    } = store.getState();
    if (isAdding) {
      return;
    }

    this.updateCursor('grab');

    // if (this.hoverPopup) {
    //   this.hoverPopup.remove();
    // }
  }

  onClickPOIs(event) {
    const {
      map: {
        addPOI: { isAdding },
      },
    } = store.getState();
    if (isAdding) {
      return;
    }

    const {
      features: [pt],
    } = event;
    const { listingHash } = pt.properties;

    store.dispatch(actions.showDrawer(`/poi/${listingHash}`));
  }

  onClick(event) {
    const {
      map: {
        addPOI: { isAdding },
      },
    } = store.getState();
    if (isAdding) {
      const {
        lngLat: { lng, lat },
      } = event;
      store.dispatch(actions.showDrawer(`/add-poi/${lng}/${lat}`));
      store.dispatch(actions.setIsAddingPOI(false));
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
    await this.fetchLayersData();
    this.updatePOIsData();
  }

  async updatePOIsData() {
    const data = poisInViewMapDataSelector(store.getState());
    const poisSource = this.map.getSource('pois');
    if (!poisSource) {
      this.map.addSource('pois', {
        type: 'geojson',
        data,
      });
      this.map.addLayer(poisLayer);
      if (!window.location.pathname)
        store.dispatch(actions.showDrawer('/places'));
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

    await store.dispatch(actions.loadPOIsInView(query));
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

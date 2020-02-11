import {
  ACTION_TYPE_SET_MAP_VIEWPORT,
  ACTION_TYPE_TOGGLE_LAYER_VISIBILITY,
  ACTION_TYPE_UPDATE_LAYERS_DATA,
  LAYER_TYPE_POI,
  ACTION_TYPE_POI_TAG_VISIBILITY,
  ACTION_TYPE_SET_IS_ADDING_POI,
} from 'config';
import Geohash from 'latlon-geohash';
import cache from 'utils/cache';
import xhr from 'utils/xhr';
import _ from 'lodash';

const { REACT_APP_IS_DEV: IS_DEV } = process.env;

export function setMapViewport(viewport) {
  return async(dispatch, getState) => {
    // if (viewport.zoom < 2) {
    //   viewport.zoom = 2;
    // }
    dispatch({ type: ACTION_TYPE_SET_MAP_VIEWPORT, payload: viewport });
    cache('location', viewport);
  };
}

export function toggleLayerVisibility(payload) {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_TOGGLE_LAYER_VISIBILITY, payload });
  };
}

export function togglePOITagVisibility(payload) {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_POI_TAG_VISIBILITY, payload });
  };
}

const fetchLayersData = _.throttle(async function([
  [swLng, swLat],
  [neLng, neLat],
]) {
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
},
2000);

export function updateLayersData(bounds) {
  return async(dispatch, getState) => {
    await dispatch({
      type: ACTION_TYPE_UPDATE_LAYERS_DATA,
      payload: await fetchLayersData(bounds),
    });
  };
}

export function setIsAddingPOI(payload) {
  return { type: ACTION_TYPE_SET_IS_ADDING_POI, payload };
}

import {
  IS_DEV,
  ACTION_TYPE_POI_TAG_VISIBILITY,
  ACTION_TYPE_UPDATE_DATA,
} from 'config';
import map from 'map';
import { WEB3, getRegistryContract } from 'utils/wallet';
import { loadPOI, parsePOI, serializeFoam } from 'utils/foam';
import xhr from 'utils/xhr';
import * as threeBox from 'utils/3box';

export function updateData(payload) {
  return { type: ACTION_TYPE_UPDATE_DATA, payload };
}

export function togglePOITagVisibility(payload) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_POI_TAG_VISIBILITY, payload });
    map.updatePOIsData();
  };
}

export function setIsAddingPOI(isAdding) {
  return async (dispatch, getState) => {
    dispatch({
      type: ACTION_TYPE_UPDATE_DATA,
      payload: { addPOI: { isAdding } },
    });
    map.updateCursor(isAdding ? 'crosshair' : '');
  };
}

export function createPOI(fields, { foam }) {
  return async (dispatch, getState) => {
    dispatch(updateData({ isLoadingPlaces: true }));

    try {
      const ipfsAddress = await xhr('post', '/poi/ipfs', fields);
      const listingHash = WEB3.utils.sha3(ipfsAddress);
      const amount = serializeFoam(foam);

      await getRegistryContract().write(
        'apply',
        listingHash,
        amount,
        ipfsAddress
      );
    } finally {
      dispatch(updateData({ isLoadingPlaces: false }));
    }
  };
}

export function viewPOI(listingHash) {
  return async (dispatch, getState) => {
    const {
      map: { pois },
    } = getState();
    let poi = pois[listingHash];
    if (!poi) {
      dispatch({
        type: ACTION_TYPE_UPDATE_DATA,
        payload: { viewPOI: { isLoading: true } },
      });
      poi = await loadPOI(listingHash);
    }
    dispatch({
      type: ACTION_TYPE_UPDATE_DATA,
      payload: { viewPOI: { listingHash, isLoading: false } },
    });
  };
}

export function loadPOIsInView(query) {
  return async (dispatch, getState) => {
    dispatch({
      type: ACTION_TYPE_UPDATE_DATA,
      payload: { poisInView: { isLoading: true } },
    });

    const pois = {};
    const poisInView = {
      isLoading: false,
      ids: [],
      tags: {
        ids: [],
        map: {},
      },
    };
    try {
      const data = IS_DEV
        ? require('data/sample-pois.json')
        : await xhr('get', '/poi/filtered', query);
      // const data = await xhr('get', '/poi/filtered', query);
      data.forEach(poi => {
        poi.tags.forEach(tag => {
          if (!poisInView.tags.map[tag]) {
            poisInView.tags.map[tag] = { name: tag, visible: true };
            poisInView.tags.ids.push(tag);
          }
        });
        poisInView.ids.push(poi.listingHash);
        pois[poi.listingHash] = parsePOI(poi);
      });
    } catch (e) {
      console.warn(e); // fail gracefully
    }

    dispatch({
      type: ACTION_TYPE_UPDATE_DATA,
      payload: { pois, poisInView },
    });
  };
}

export function loadMyPOIs() {
  return async (dispatch, getState) => {
    const {
      wallet: { account },
    } = getState();

    dispatch({
      type: ACTION_TYPE_UPDATE_DATA,
      payload: { myPOIs: { isLoading: true } },
    });

    const query = {
      neLat: 90,
      neLng: 180,
      swLat: -90,
      swLng: -180,
      limit: 101,
      offset: 0,
      sort: 'most_value',
      status: ['application', 'challenged', 'listing'],
      creator: account,
    };
    const data = await xhr('get', '/poi/filtered', query);

    const pois = {};
    const myPOIs = {
      isLoading: false,
      ids: [],
    };
    data.forEach(poi => {
      myPOIs.ids.push(poi.listingHash);
      pois[poi.listingHash] = parsePOI(poi);
    });

    dispatch({
      type: ACTION_TYPE_UPDATE_DATA,
      payload: { pois, myPOIs },
    });
  };
}

export function loadBookmarks() {
  return async (dispatch, getState) => {
    dispatch(updateData({ bookmarks: { isLoading: true } }));
    const {
      wallet: { account },
    } = getState();
    await threeBox.setUp(account);
    const pois = {};
    const bookmarks = { isLoading: false, ids: [] };
    bookmarks.ids = await threeBox.loadBookmarks();
    (await Promise.all(bookmarks.ids.map(loadPOI))).forEach(poi => {
      pois[poi.listingHash] = poi;
    });
    dispatch(updateData({ pois, bookmarks }));
  };
}

export function toggleBookmark(listingHash) {
  return async (dispatch, getState) => {
    dispatch(updateData({ bookmarks: { isToggling: true } }));
    const {
      wallet: { account },
    } = getState();
    await threeBox.setUp(account);
    const ids = getState().map.bookmarks.ids.slice(0);
    const idx = ids.indexOf(listingHash);
    const adding = !~idx;
    if (adding) {
      ids.push(listingHash);
    } else {
      ids.splice(idx, 1);
    }
    await threeBox.saveBookmarks(ids);
    dispatch(updateData({ bookmarks: { ids, isToggling: false } }));
  };
}

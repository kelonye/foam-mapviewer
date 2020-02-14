import { createSelector } from 'reselect';
import { MENU_WIDTH, DRAWER_WIDTH, LAYER_TYPE_POI } from 'config';
import _ from 'lodash';

export const leftSelector = createSelector(
  state => state.menu.isShowing,
  state => state.drawer.isShowing,
  (menu, drawer) => {
    let ret = 0;
    if (menu) ret += MENU_WIDTH;
    if (drawer) ret += DRAWER_WIDTH;
    return ret;
  }
);

export const poisSelector = createSelector(
  state => state.map.layers[LAYER_TYPE_POI].visible,
  state => state.map.layers[LAYER_TYPE_POI].tagsArray,
  state => state.map.layers[LAYER_TYPE_POI].poisIds,
  state => state.map.layers[LAYER_TYPE_POI].poisByListingHash,
  (visible, tags, poisIds, poisByListingHash) => {
    return !visible
      ? []
      : poisIds
          .map(poiId => poisByListingHash[poiId])
          .filter(poi => !!_.intersection(poi.tags, tags).length);
  }
);

export const poisMapDataSelector = createSelector(poisSelector, pois => {
  return {
    type: 'FeatureCollection',
    features: pois.map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
      properties: {
        name: p.name,
        status: p.status,
        foam: p.foam,
        listingHash: p.listingHash,
      },
    })),
  };
});

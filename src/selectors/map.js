import { createSelector } from 'reselect';
import { MENU_WIDTH, DRAWER_WIDTH } from 'config';
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

export const tagsArraySelector = createSelector(
  state => state.map.tags,
  tags =>
    Object.entries(tags)
      .filter(([, v]) => v)
      .map(([k]) => k)
);

export const tagsSelector = createSelector(
  state => state.map.tags,
  tagsArraySelector,
  tags => {
    return _.orderBy(
      Object.entries(tags).map(([name, visible]) => ({ name, visible })),
      'name'
    );
  }
);

export const poisSelector = createSelector(
  tagsArraySelector,
  state => state.map.poisIds,
  state => state.map.poisByListingHash,
  (tags, poisIds, poisByListingHash) => {
    return poisIds
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

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

export const tagsInViewSelector = createSelector(
  state => state.map.poisInView.tags.ids,
  state => state.map.poisInView.tags.map,
  (ids, map) => ids.map(id => map[id])
);

export const filteredTagsInViewSelector = createSelector(
  tagsInViewSelector,
  tags => tags.filter(poi => poi.visible)
);

export const poisInViewSelector = createSelector(
  filteredTagsInViewSelector,
  state => state.map.poisInView.ids,
  state => state.map.pois,
  (tags, ids, map) => {
    const tagIds = tags.map(tag => tag.name);
    return ids
      .map(poiId => map[poiId])
      .filter(poi => !!_.intersection(poi.tags, tagIds).length);
  }
);

export const poisInViewMapDataSelector = createSelector(
  poisInViewSelector,
  pois => ({
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
  })
);

export const myPOIsSelector = createSelector(
  state => state.map.myPOIs.ids,
  state => state.map.pois,
  (ids, map) => ids.map(id => map[id])
);

export const bookmarksSelector = createSelector(
  state => state.map.bookmarks.ids,
  state => state.map.pois,
  (ids, map) => ids.map(id => map[id])
);

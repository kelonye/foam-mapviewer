import { createSelector } from 'reselect';
import { MENU_WIDTH, DRAWER_WIDTH, LAYER_TYPE_POI } from 'config';
import POIsComponent from 'components/Map/MapPOIs';
import _ from 'lodash';

const COMPONENTS = {
  [LAYER_TYPE_POI]: POIsComponent,
};

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

export const layersSelector = createSelector(
  state => ({ ...state.map.layers[LAYER_TYPE_POI], id: LAYER_TYPE_POI }),
  (...layers) => {
    return layers
      .filter(l => !!l.visible)
      .map(({ id }) => ({
        id,
        Component: COMPONENTS[id],
      }));
  }
);

export const poisSelector = createSelector(
  state => state.map.layers[LAYER_TYPE_POI].visible,
  state =>
    Object.entries(state.map.layers[LAYER_TYPE_POI].tags)
      .filter(([, v]) => v)
      .map(([k]) => k),
  state => state.map.layers[LAYER_TYPE_POI].pois,
  (visible, tags, pois) => {
    return !visible
      ? []
      : pois.filter(p => !!_.intersection(p.tags, tags).length);
  }
);

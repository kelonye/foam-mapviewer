import { createSelector } from 'reselect';
import { MENU_WIDTH, DRAWER_WIDTH, LAYER_TYPE_POI } from 'config';
import POIsComponent from 'components/Map/MapPOIs';

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
  state => ({ ...state.map.layers[LAYER_TYPE_POI] }),
  (...layers) => {
    return layers
      .filter(l => !!l.visible)
      .map(({ data }) => ({
        id: LAYER_TYPE_POI,
        data,
        Component: POIsComponent,
      }));
  }
);

import { createSelector } from 'reselect';
import { LAYER_TYPE_POI } from 'config';

export const layersSelector = createSelector(
  state => state.map.layers[LAYER_TYPE_POI].visible,
  visible => {
    const ret = [];
    ret.push({
      id: LAYER_TYPE_POI,
      visible,
      name: 'Points of Interest',
    });
    return ret;
  }
);

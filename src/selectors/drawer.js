import { createSelector } from 'reselect';
import { LAYER_TYPE_POI } from 'config';
import _ from 'lodash';

export const layersSelector = createSelector(
  state => {
    const { visible, tags } = state.map.layers[LAYER_TYPE_POI];
    return { visible, tags };
  },
  ({ visible, tags }) => {
    const ret = [];
    ret.push({
      id: LAYER_TYPE_POI,
      visible,
      name: 'Points of Interest',
      tags: _.orderBy(
        Object.entries(tags).map(([name, visible]) => ({ name, visible })),
        'name'
      ),
    });
    return ret;
  }
);

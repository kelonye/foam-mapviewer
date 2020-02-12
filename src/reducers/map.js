import {
  ACTION_TYPE_TOGGLE_LAYER_VISIBILITY,
  ACTION_TYPE_UPDATE_LAYERS_DATA,
  LAYER_TYPE_POI,
  ACTION_TYPE_POI_TAG_VISIBILITY,
  ACTION_TYPE_SET_IS_ADDING_POI,
} from 'config';

const DEFAULT_STATE = {
  layers: {
    [LAYER_TYPE_POI]: {
      visible: true,
      pois: [],
      tags: {},
      tagsArray: [],
    },
  },
  isAddingPOI: false,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_TOGGLE_LAYER_VISIBILITY: {
      const type = action.payload;
      const s = Object.assign({}, state);
      s.layers[type].visible = !s.layers[type].visible;
      return s;
    }

    case ACTION_TYPE_UPDATE_LAYERS_DATA: {
      const layers = action.payload;
      const s = Object.assign({}, state);
      layers.forEach(({ type, data }) => {
        Object.entries(data).forEach(([k, v]) => {
          s.layers[type][k] = v;
        });
      });
      s.layers[LAYER_TYPE_POI].tagsArray = recomputeTagsArray(
        s.layers[LAYER_TYPE_POI].tags
      );
      return s;
    }

    case ACTION_TYPE_POI_TAG_VISIBILITY: {
      const s = Object.assign({}, state);
      s.layers[LAYER_TYPE_POI].tags[action.payload] = !s.layers[LAYER_TYPE_POI]
        .tags[action.payload];
      s.layers[LAYER_TYPE_POI].tagsArray = recomputeTagsArray(
        s.layers[LAYER_TYPE_POI].tags
      );
      return s;
    }

    case ACTION_TYPE_SET_IS_ADDING_POI: {
      return Object.assign({}, state, { isAddingPOI: action.payload });
    }

    default:
      return state;
  }
};

function recomputeTagsArray(tags) {
  return Object.entries(tags)
    .filter(([, v]) => v)
    .map(([k]) => k);
}

import {
  ACTION_TYPE_TOGGLE_LAYER_VISIBILITY,
  ACTION_TYPE_UPDATE_LAYERS_DATA,
  LAYER_TYPE_POI,
  ACTION_TYPE_POI_TAG_VISIBILITY,
} from 'config';

const DEFAULT_STATE = {
  [LAYER_TYPE_POI]: {
    visible: true,
    pois: [],
    tags: {},
  },
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_TOGGLE_LAYER_VISIBILITY: {
      const type = action.payload;
      const s = Object.assign({}, state);
      s[type].visible = !s[type].visible;
      return s;
    }

    case ACTION_TYPE_UPDATE_LAYERS_DATA: {
      const layers = action.payload;
      const s = Object.assign({}, state);
      layers.forEach(({ type, data }) => {
        Object.entries(data).forEach(([k, v]) => {
          s[type][k] = v;
        });
      });
      return s;
    }

    case ACTION_TYPE_POI_TAG_VISIBILITY: {
      const s = Object.assign({}, state);
      s[LAYER_TYPE_POI].tags[action.payload] = !s[LAYER_TYPE_POI].tags[
        action.payload
      ];
      return s;
    }

    default:
      return state;
  }
};

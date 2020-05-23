import _ from 'lodash';
import clone from 'utils/clone';
import {
  ACTION_TYPE_UPDATE_DATA,
  ACTION_TYPE_POI_TAG_VISIBILITY,
} from 'config';

const DEFAULT_STATE = {
  pois: {}, // all pois including bookmarks and my places

  poisInView: {
    isLoading: true, // should be true on app load
    ids: [],
    tags: {
      ids: [],
      map: {},
    },
  },

  myPOIs: {
    isLoading: true, // should be true on app load
    ids: [],
    tags: {
      ids: [],
      map: {},
    },
  },

  bookmarks: {
    ids: [],
    isLoading: true, // should be true on app load
  },

  addPOI: {
    isAdding: false,
  },

  viewPOI: {
    isLoading: false,
  },
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_UPDATE_DATA: {
      const s = clone(state);
      for (const k in action.payload) {
        if (action.payload.hasOwnProperty(k)) {
          s[k] = _.assign(s[k], action.payload[k]);
        }
      }
      return s;
    }

    case ACTION_TYPE_POI_TAG_VISIBILITY: {
      const s = Object.assign({}, state);
      s.poisInView.tags.map[action.payload].visible = !s.poisInView.tags.map[
        action.payload
      ].visible;
      return clone(s);
    }

    default:
      return state;
  }
};

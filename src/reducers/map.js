import {
  ACTION_TYPE_UPDATE_DATA,
  ACTION_TYPE_POI_TAG_VISIBILITY,
  ACTION_TYPE_SET_IS_ADDING_POI,
} from 'config';

const DEFAULT_STATE = {
  pois: [],
  poisIds: [],
  poisByListingHash: {},
  tags: {},
  bookmarksMap: {},
  bookmarksList: [],
  isAddingPOI: false,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_UPDATE_DATA: {
      return Object.assign({}, state, action.payload);
    }

    case ACTION_TYPE_POI_TAG_VISIBILITY: {
      const s = Object.assign({}, state);
      s.tags[action.payload] = !s.tags[action.payload];
      return s;
    }

    case ACTION_TYPE_SET_IS_ADDING_POI: {
      return Object.assign({}, state, { isAddingPOI: action.payload });
    }

    default:
      return state;
  }
};

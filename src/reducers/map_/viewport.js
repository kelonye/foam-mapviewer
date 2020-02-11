import { ACTION_TYPE_SET_MAP_VIEWPORT, DEFAULT_LOCATION } from 'config';
import cache from 'utils/cache';

const DEFAULT_STATE = cache('location') || DEFAULT_LOCATION;

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_SET_MAP_VIEWPORT: {
      return action.payload;
    }

    default:
      return state;
  }
};

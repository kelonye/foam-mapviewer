import cache from 'utils/cache';
import { ACTION_TYPE_TOGGLE_THEME, ACTION_TYPE_IS_MOBILE } from 'config';

const DEFAULT_STATE = {
  isLoaded: false,
  error: null,
  theme: cache('theme') || 'dark',
  isMobile: true,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_TOGGLE_THEME: {
      return Object.assign({}, state, {
        theme: state.theme === 'dark' ? 'light' : 'dark',
      });
    }

    case ACTION_TYPE_IS_MOBILE: {
      return Object.assign({}, state, {
        isMobile: action.payload,
      });
    }
    default:
      return state;
  }
};

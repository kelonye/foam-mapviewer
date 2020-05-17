import cache from 'utils/cache';
import { ACTION_TYPE_TOGGLE_THEME, ACTION_TYPE_IS_MOBILE } from 'config';
import { isMobile } from 'utils';
import map from 'map';

export function toggleTheme() {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_TOGGLE_THEME });
    cache('theme', getState().app.theme);
    map.updateStyle();
  };
}

export function updateIsMobile() {
  return { type: ACTION_TYPE_IS_MOBILE, payload: isMobile() };
}

import { ACTION_TYPE_SHOW_DRAWER, ACTION_TYPE_HIDE_DRAWER } from 'config';

export function showDrawer(payload) {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_SHOW_DRAWER, payload });
  };
}

export function hideDrawer() {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_HIDE_DRAWER });
  };
}

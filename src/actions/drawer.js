import { ACTION_TYPE_SHOW_DRAWER, ACTION_TYPE_HIDE_DRAWER } from 'config';
import { history } from 'store';

export function showDrawer(payload) {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_SHOW_DRAWER, payload });
    await dispatch(navigate(payload));
  };
}

export function hideDrawer() {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_HIDE_DRAWER });
  };
}

export function navigate(payload) {
  return async(dispatch, getState) => {
    history.push(payload);
  };
}

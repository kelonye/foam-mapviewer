import { ACTION_TYPE_TOGGLE_MENU } from 'config';
import * as actions from 'actions';

export function toggleMenu(payload) {
  return async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_TOGGLE_MENU });

    const { menu, drawer } = getState();
    if (!menu.isShowing && drawer.isShowing) {
      dispatch(actions.hideDrawer());
    }
  };
}

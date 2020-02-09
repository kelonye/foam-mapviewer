import { createSelector } from 'reselect';
import { MENU_WIDTH } from 'config';

export const widthSelector = createSelector(
  state => state.menu.isShowing,
  isShowing => (isShowing ? MENU_WIDTH : 0)
);

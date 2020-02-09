import { ACTION_TYPE_SHOW_DRAWER, ACTION_TYPE_HIDE_DRAWER } from 'config';

const DEFAULT_STATE = {
  isShowing: !!process.env.REACT_APP_INITIAL_DRAWER_TYPE,
  type: process.env.REACT_APP_INITIAL_DRAWER_TYPE || '',
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_SHOW_DRAWER: {
      const type = action.payload || state.type;
      const opts = {
        isShowing: true,
        type,
      };
      return Object.assign({}, state, opts);
    }

    case ACTION_TYPE_HIDE_DRAWER: {
      const type = DEFAULT_STATE.type;
      const isShowing = false;

      return Object.assign({}, state, {
        isShowing,
        type,
      });
    }

    default:
      return state;
  }
};

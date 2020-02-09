import { ACTION_TYPE_TOGGLE_MENU } from 'config';

const DEFAULT_STATE = {
  isShowing: true,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_TOGGLE_MENU: {
      return Object.assign({}, state, { isShowing: !state.isShowing });
    }

    default:
      return state;
  }
};

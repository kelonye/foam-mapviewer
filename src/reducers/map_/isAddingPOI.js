import { ACTION_TYPE_SET_IS_ADDING_POI } from 'config';

const DEFAULT_STATE = false;

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPE_SET_IS_ADDING_POI: {
      return { isAddingPOI: action.payload };
    }

    default:
      return state;
  }
};

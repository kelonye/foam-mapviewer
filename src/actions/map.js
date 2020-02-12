import {
  ACTION_TYPE_TOGGLE_LAYER_VISIBILITY,
  ACTION_TYPE_POI_TAG_VISIBILITY,
  ACTION_TYPE_SET_IS_ADDING_POI,
} from 'config';
import map from 'map';

export function toggleLayerVisibility(payload) {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_TOGGLE_LAYER_VISIBILITY, payload });
    map.updatePOIsData();
  };
}

export function togglePOITagVisibility(payload) {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_POI_TAG_VISIBILITY, payload });
    map.updatePOIsData();
  };
}

export function setIsAddingPOI(payload) {
  return async(dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_SET_IS_ADDING_POI, payload });
    map.updateCursor(payload ? 'crosshair' : '');
  };
}

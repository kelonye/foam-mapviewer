import { combineReducers } from 'redux';
import viewport from './viewport';
import layers from './layers';
import isAddingPOI from './isAddingPOI';

export default combineReducers({
  isAddingPOI,
  layers,
  viewport,
});

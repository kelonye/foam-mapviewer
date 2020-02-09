import { combineReducers } from 'redux';
import * as asyncInitialState from 'redux-async-initial-state';
import app from './app';
import map from './map';
import menu from './menu';
import drawer from './drawer';

export default asyncInitialState.outerReducer(
  combineReducers({
    app,
    map,
    menu,
    drawer,
    asyncInitialState: asyncInitialState.innerReducer, // last
  })
);

import { combineReducers } from 'redux';
import * as asyncInitialState from 'redux-async-initial-state';
import app from './app';
import map from './map';
import menu from './menu';
import drawer from './drawer';
import wallet from './wallet';

export default asyncInitialState.outerReducer(
  combineReducers({
    app,
    map,
    menu,
    drawer,
    wallet,
    asyncInitialState: asyncInitialState.innerReducer, // last
  })
);

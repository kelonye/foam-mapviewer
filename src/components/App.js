import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { DANGER_COLOR } from 'config';
import Header from './Header/Header';
import MapGL from './Map/Map';
import Drawer from './Drawer/Drawer';
import Menu from './Menu/Menu';
import Snackbar from './Snackbar';
import Loader from './Loader';
import { Router } from 'react-router-dom';
import { history } from 'store';

const Component = ({ error, isLoaded }) => {
  let pane;
  if (error) {
    pane = <div style={{ padding: 50, color: DANGER_COLOR }}>{error}</div>;
  } else if (isLoaded) {
    pane = (
      <div>
        <MapGL />
        <Header />
        <Drawer />
        <Menu />
        <Snackbar />
      </div>
    );
  } else {
    pane = <Loader />;
  }
  return <Router {...{ history }}>{pane}</Router>;
};

export default connect(state => {
  const { app, user } = state;
  const { isLoaded, error } = app;
  let err;
  if (error) {
    console.log(error);
    err = error.message || 'Error Loading Application!';
  }

  return {
    isLoaded,
    user,
    error: err,
  };
}, mapDispatchToProps)(Component);

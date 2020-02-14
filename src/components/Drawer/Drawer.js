import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Route, Switch } from 'react-router-dom';
import { HEADER_HEIGHT, DRAWER_WIDTH } from 'config';
import Layers from './DrawerLayers';
import Wallet from './DrawerWallet/DrawerWallet';
// import Welcome from './DrawerWelcome';
import AddPOI from './DrawerAddPOI';
import { widthSelector as menuWidthSelector } from 'selectors/menu';

const ICON_SIZE = 30;

const Component = ({ drawer, menuWidth, hideDrawer }) => {
  const drawerStyle = {
    top: HEADER_HEIGHT,
    left:
      (drawer.isShowing ? menuWidth : 0) +
      (drawer.isShowing ? 0 : -DRAWER_WIDTH),
    width: DRAWER_WIDTH,
  };

  return (
    <div className="drawer" style={drawerStyle}>
      <span className="close">
        <IconButton onClick={hideDrawer}>
          <ArrowBackIcon
            style={{
              margin: '-4px 0px 0 -3px',
              width: ICON_SIZE,
              height: ICON_SIZE,
            }}
          />
        </IconButton>
      </span>
      <Switch>
        <Route path={'/layers'} component={Layers} />
        <Route path={'/wallet'} component={Wallet} />
        <Route path={'/add-poi/:lng/:lat'} component={AddPOI} />
        {/*<Route path={'/'} component={Welcome} />*/}
      </Switch>
    </div>
  );
};

export default connect(state => {
  const { drawer } = state;
  return {
    drawer,
    menuWidth: menuWidthSelector(state),
  };
}, mapDispatchToProps)(Component);

import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  HEADER_HEIGHT,
  DRAWER_WIDTH,
  DRAWER_TYPE_LAYERS,
  DRAWER_TYPE_WALLET,
} from 'config';
import Layers from './DrawerLayers';
import Wallet from './DrawerWallet';
import { widthSelector as menuWidthSelector } from 'selectors/menu';

const DRAWER_TYPE_COMPONENTS = {
  [DRAWER_TYPE_LAYERS]: <Layers />,
  [DRAWER_TYPE_WALLET]: <Wallet />,
};

const ICON_SIZE = 30;

const Component = ({ drawer, menuWidth, hideDrawer }) => {
  const drawerContent = DRAWER_TYPE_COMPONENTS[drawer.type];
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
      {drawerContent}
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

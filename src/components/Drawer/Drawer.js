import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Route, Switch } from 'react-router-dom';
import { HEADER_HEIGHT, DRAWER_WIDTH } from 'config';
import { widthSelector as menuWidthSelector } from 'selectors/menu';
import Close from 'components/Drawer/DrawerClose';

const Component = ({ drawer, menuWidth, hideDrawer }) => {
  const drawerStyle = {
    top: HEADER_HEIGHT,
    left:
      (drawer.isShowing ? menuWidth : 0) +
      (drawer.isShowing ? 0 : -DRAWER_WIDTH),
    width: DRAWER_WIDTH,
  };

  return (
    <div className="side-drawer drawer" style={drawerStyle}>
      <Close />
      <Switch>
        {/*
         */}
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

import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Menu, MenuItem } from '@material-ui/core';
import Button from './MenuButton';

class Component extends React.Component {
  state = {
    showingMenu: false,
    anchorEl: null,
  };

  onClick(event) {
    const { hideDrawer } = this.props;
    hideDrawer();
    this.showMenu(event.target);
  }

  showMenu(anchorEl) {
    this.setState({ anchorEl });
  }

  closeMenu() {
    this.showMenu(null);
  }

  startAddPOI() {
    const { setIsAddingPOI } = this.props;
    setIsAddingPOI(true);
    this.closeMenu();
  }

  startCreateSignal() {}

  render() {
    const { anchorEl } = this.state;
    return (
      <React.Fragment>
        <Button {...this.props} onClick={e => this.onClick(e)} />
        <Menu
          id="add-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => this.closeMenu()}
        >
          <MenuItem onClick={() => this.startAddPOI()}>
            Register a Point of Interest
          </MenuItem>
          <MenuItem onClick={() => this.startCreateSignal()} disabled>
            Create a Signal
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default connect(state => {
  const { drawer } = state;
  return {
    drawerType: drawer.type,
  };
}, mapDispatchToProps)(Component);

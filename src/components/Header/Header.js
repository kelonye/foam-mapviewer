import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { HEADER_HEIGHT, MENU_WIDTH } from 'config';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

class Component extends React.Component {
  state = {};

  render() {
    return (
      <div
        className={'header flex flex--align-center'}
        style={{ height: HEADER_HEIGHT }}
      >
        {this.renderLeft()}

        <div className="header__sep">
          <div className="header__title-text">FOAM Map Viewer</div>
        </div>

        {this.renderRight()}
      </div>
    );
  }

  renderLeft() {
    const { toggleMenu } = this.props;

    return (
      <div className="flex flex--align-center flex--grow">
        <span className="menu-button-container" style={{ width: MENU_WIDTH }}>
          <IconButton
            data-tip
            data-for="menuButton"
            className="header__menu"
            onClick={toggleMenu}
          >
            <MenuIcon style={{ height: 28, width: 28 }} />
          </IconButton>
        </span>
      </div>
    );
  }

  renderRight() {
    return null;
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);

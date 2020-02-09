import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Badge, IconButton, Tooltip } from '@material-ui/core';

const TOOLTIP_STYLES = {
  display: 'none',
  top: 0,
  left: 45,
  fontSize: 16,
  padding: '5px 10px',
};
const ACTIVE_BACKGROUND_COLOR = '#f50057';
const ACTIVE_COLOR = '#ffffff';
const ICON_SIZE = 30;

class Component extends React.Component {
  state = {
    isHover: false,
  };

  onClick(e) {
    const { showDrawer, type, onClick } = this.props;
    if (onClick) {
      onClick();
    } else {
      showDrawer(type);
    }
  }

  onMouse(e, bool) {
    this.setState({ isHover: bool });
  }

  render() {
    const {
      drawerType,
      type,
      label,
      badgeContent,
      tip,
      Icon,
      top,
    } = this.props;
    const { isHover } = this.state;
    const isActive = drawerType === type;
    const active = isHover || isActive;

    const badge =
      badgeContent > 0 ? (
        <Badge
          badgeContent={badgeContent}
          color="primary"
          className="menu-button-badge"
          style={{ width: 20, height: 20 }}
        />
      ) : null;

    return (
      <div
        className="menu-button"
        onClick={e => this.onClick(e)}
        onMouseEnter={e => this.onMouse(e, true)}
        onMouseLeave={e => this.onMouse(e, false)}
        style={{
          backgroundColor: active ? ACTIVE_BACKGROUND_COLOR : 'initial',
          color: active ? ACTIVE_COLOR : 'initial',
          top,
        }}
      >
        {badge}
        <Tooltip title={tip} styles={TOOLTIP_STYLES}>
          <IconButton className="menu-button-icon">
            <Icon
              styles={{
                width: ICON_SIZE,
                height: ICON_SIZE,
              }}
            />
          </IconButton>
        </Tooltip>
        <div className="menu-button-label">{label}</div>
      </div>
    );
  }
}

export default connect(state => {
  const { drawer } = state;
  return {
    drawerType: drawer.type,
  };
}, mapDispatchToProps)(Component);

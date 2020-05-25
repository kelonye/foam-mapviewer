import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const ICON_SIZE = 30;

const Component = ({ goBack, hideDrawer, navigate }) => (
  <div className="drawer__close">
    <IconButton onClick={goBack ? () => navigate(goBack) : hideDrawer}>
      <ArrowBackIcon
        style={{
          margin: '-4px 0px 0 -3px',
          width: ICON_SIZE,
          height: ICON_SIZE,
        }}
      />
    </IconButton>
  </div>
);

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

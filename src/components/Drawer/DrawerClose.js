import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { history } from 'utils/store';

const ICON_SIZE = 30;

const onGoBack = () => history.go(-2);

const Component = ({ goBack, hideDrawer }) => (
  <div className="drawer__close">
    <IconButton onClick={goBack ? onGoBack : hideDrawer}>
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

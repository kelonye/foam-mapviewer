import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Snackbar, Button } from '@material-ui/core';

function Component({ isAddingPOI, setIsAddingPOI }) {
  function getIsOpen() {
    return isAddingPOI;
  }

  function getContent() {
    let message, action;
    if (isAddingPOI) {
      message = 'Click on map to add the new Point of Interest...';
      action = (
        <React.Fragment>
          <Button color="secondary" size="small" onClick={e => handleClose(e)}>
            CANCEL
          </Button>
        </React.Fragment>
      );
    }
    return { message, action };
  }

  function handleClose(e, reason) {
    if (reason !== 'clickaway') {
      if (isAddingPOI) {
        setIsAddingPOI(false);
      }
    }
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={getIsOpen()}
      onClose={handleClose}
      {...getContent()}
    />
  );
}

export default connect(state => {
  const { isAddingPOI } = state.map;
  return {
    isAddingPOI,
  };
}, mapDispatchToProps)(Component);

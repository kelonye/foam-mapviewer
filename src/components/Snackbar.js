import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Snackbar, Button } from '@material-ui/core';

class Component extends React.Component {
  getIsOpen() {
    const { isAddingPOI } = this.props;
    return isAddingPOI;
  }

  getContent() {
    const { isAddingPOI } = this.props;

    let message, action;
    if (isAddingPOI) {
      message = 'Click on map to add the new Point of Interest...';
      action = (
        <React.Fragment>
          <Button
            color="secondary"
            size="small"
            onClick={e => this.handleClose(e)}
          >
            CANCEL
          </Button>
        </React.Fragment>
      );
    }
    return { message, action };
  }

  handleClose() {
    const { isAddingPOI, setIsAddingPOI } = this.props;

    if (isAddingPOI) {
      setIsAddingPOI(false);
    }
  }

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.getIsOpen()}
        onClose={e => this.handleClose(e)}
        {...this.getContent()}
      />
    );
  }
}

export default connect(state => {
  const { isAddingPOI } = state.map;
  return {
    isAddingPOI,
  };
}, mapDispatchToProps)(Component);

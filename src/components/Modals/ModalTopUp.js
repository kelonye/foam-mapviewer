import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    width: 130,
    margin: '0 5px;',
  },
}));

function Component({ handleClose, hideDrawer }) {
  const classes = useStyles();

  React.useEffect(
    function() {
      hideDrawer();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        Get FOAM (<small>work in progress</small>)
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          Select one of the options to purchase FOAM:
        </DialogContentText>
        <div className="flex flex--justify-center">
          <Button color="default" variant="contained" className={classes.button}>
            Radar Relay
          </Button>
          <Button color="default" variant="contained" className={classes.button}>
            Uniswap
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

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
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    width: 130,
    margin: '0 5px;',
  },
}));

function Component({
  navigate,
  match: {
    params: { listingHash },
  },
}) {
  const classes = useStyles();
  const [reason, setReason] = React.useState('');

  React.useEffect(
    function() {}, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleClose = () => {
    navigate(`/poi/${listingHash}`);
  };

  const handleSubmit = async() => {
    handleClose();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      className={classes.root}
      fullWidth
    >
      <DialogTitle id="dialog-title">
        Challenge POI (work in progress)
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          Describe the issues with this Point of Interest
        </DialogContentText>
        <div className="flex flex--justify-center">
          <TextField
            id="reason"
            label="Reason"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={'Say something here...'}
            value={reason}
            onChange={e => setReason(e.target.value)}
            fullWidth
            multiline
            rows="4"
            required
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="secondary" disabled>
          Challenge
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

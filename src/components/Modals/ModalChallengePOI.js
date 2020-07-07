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
import { getRegistryContract } from 'utils/wallet';
import Promise from 'bluebird';
import xhr from 'utils/xhr';
import sl from 'utils/sl';

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
  const [amount, setAmount] = React.useState(50);

  React.useEffect(
    function() {}, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleClose = () => {
    navigate(`/poi/${listingHash}`);
  };

  const handleSubmit = async () => {
    if (!amount) {
      return sl('error', 'A minimum of 50 FOAM is required.', 'Error');
    }
    if (!reason) {
      return sl('error', 'Please enter a reason(s)...', 'Error');
    }
    const ipfsAddr = await xhr('post', '/challenge/ipfs', { reason });
    await new Promise((resolve, reject) => {
      getRegistryContract().challenge(
        listingHash,
        amount,
        ipfsAddr,
        (err, info) => {
          if (err) {
            return reject(err);
          }
          console.log(info);
          resolve();
        }
      );
    });

    sl(
      'success',
      "Transaction was created, Wait until it's mined ...",
      'Success',
      handleClose
    );
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
          Describe the issues with this Place
        </DialogContentText>
        <div className="flex flex--justify-center" style={{ marginBottom: 20 }}>
          <TextField
            id="amount"
            label="FOAM"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={'50 FOAM minimum...'}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            fullWidth
          />
        </div>
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
            rows="2"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Challenge
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

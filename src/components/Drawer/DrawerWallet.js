import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button } from '@material-ui/core';
import Loader from 'components/Loader';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  metaMaskButton: {
    backgroundColor: '#f5841f',
    boxShadow: 'none',
    borderBottom: 'solid 4px #763e1a',
    color: '#763e1a',
    '&:hover': {
      backgroundColor: '#f5841f',
    },
  },
}));

const Component = ({
  isLoaded,
  loadWallet,
  balance,
  account,
  activateWallet,
}) => {
  const classes = useStyles();

  React.useEffect(
    function() {
      loadWallet();
    },
    [loadWallet]
  );

  return (
    <div>
      <h4 className="drawer--title">Wallet</h4>
      <div className="drawer--content">
        {!isLoaded ? (
          <Loader fullscreen={false} />
        ) : account ? (
          <div>
            <div>Account: {account}</div>
            <div>Balance: {balance}</div>
            {/*<button onClick={deactivateWallet}>disconnect</button>*/}
          </div>
        ) : (
          <div>
            <Button
              variant="contained"
              onClick={activateWallet}
              className={classes.metaMaskButton}
              fullWidth
            >
              Connect to MetaMask
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(({ wallet }) => {
  return {
    ...wallet,
  };
}, mapDispatchToProps)(Component);

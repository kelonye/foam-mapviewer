import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Loader from 'components/Loader';
import { SECONDARY_COLOR } from 'config';

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
  walletError: {
    color: SECONDARY_COLOR,
    marginTop: 10,
  },
}));

const Component = ({ isLoading, account, activateWallet, children }) => {
  const classes = useStyles();

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : account ? (
        <div>{children}</div>
      ) : (
        <div>
          <Button
            variant="contained"
            onClick={activateWallet}
            className={classes.metaMaskButton}
            disabled={!window.enable}
            fullWidth
          >
            Connect Wallet
          </Button>
          {/*
            <div
              className={clsx(
                classes.walletError,
                'flex',
                'flex--justify-center',
                'center-align'
              )}
            >
              {account
                ? null
                : 'A Web 3.0-enabled Ethereum Wallet (such as MetaMask) is required'}
            </div>
            */}
        </div>
      )}
    </div>
  );
};

export default connect(({ wallet }) => {
  return {
    ...wallet,
  };
}, mapDispatchToProps)(Component);

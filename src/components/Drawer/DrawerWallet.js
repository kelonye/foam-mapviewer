import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

let web3;
if (window.ethereum) {
  web3 = new window.Web3(window.ethereum);
}

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

const Component = () => {
  const classes = useStyles();
  const [balance, setBalance] = React.useState(0);
  const [account, setAccount] = React.useState(null);

  React.useEffect(function() {
    connect();
  }, []);

  function connect() {
    if (!web3) {
      return console.error('You have to install MetaMask!');
    }

    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return console.error(err);
      }

      const [account] = accounts;
      if (!account) {
        return console.error('No account was selected');
      }

      setAccount(account);

      const tokenContractAddress = '0x4946fcea7c692606e8908002e55a582af44ac121';
      const abi = [
        {
          constant: true,
          inputs: [{ name: '_owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: 'balance', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ];
      const contract = web3.eth.contract(abi).at(tokenContractAddress);
      contract.balanceOf(account, (err, info) => {
        if (err) {
          return console.error(err);
        }
        setBalance(info.c[0]);
      });
    });
  }

  function activate() {
    window.ethereum.enable().then(account => {
      connect();
    });
  }

  // function deactivate() {
  //   window.ethereum.disconnect().then(account => {
  //     connect();
  //   });
  // }

  return (
    <div>
      <h4 className="drawer--title">Wallet</h4>
      <div className="drawer--content">
        {account ? (
          <div>
            <div>Account: {account}</div>
            <div>Balance: {balance}</div>
            {/*<button onClick={deactivate}>disconnect</button>*/}
          </div>
        ) : (
          <div>
            <Button
              variant="contained"
              onClick={activate}
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

export default connect(() => {
  return {};
}, mapDispatchToProps)(Component);

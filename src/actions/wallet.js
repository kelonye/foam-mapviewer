import Promise from 'bluebird';
import { web3, ACTION_TYPE_UPDATE_WALLET } from 'config';
import FOAM_TOKEN_ABI from 'data/abis/form-token';

export function loadWallet() {
  return async(dispatch, getState) => {
    dispatch(updateWallet({ isLoaded: false }));

    try {
      if (!web3) {
        throw new Error('You have to install MetaMask!');
      }

      const {
        wallet: { contracts },
      } = getState();

      let contract, account;

      await new Promise((resolve, reject) => {
        web3.eth.getAccounts((err, accounts) => {
          if (err) {
            return reject(err);
          }

          const [a] = accounts;
          if (!a) {
            return reject(new Error('No account was selected'));
          }

          dispatch(updateWallet({ account: a }));

          const {
            wallet: { account: b },
          } = getState();
          contract = web3.eth
            .contract(FOAM_TOKEN_ABI.abi)
            .at(contracts.foamToken);
          account = b;
          resolve();
        });
      });

      await new Promise((resolve, reject) => {
        contract.balanceOf(account, (err, info) => {
          if (err) {
            return reject(err);
          }
          dispatch(updateWallet({ balance: info.c[0] }));
          resolve();
        });
      });

      await new Promise((resolve, reject) => {
        contract.allowance(account, contracts.foamRegistry, (err, info) => {
          if (err) {
            return reject(err);
          }
          dispatch(updateWallet({ approved: info.c[0] }));
          resolve();
        });
      });
    } finally {
      dispatch(updateWallet({ isLoaded: true }));
    }
  };
}

export function activateWallet() {
  return async(dispatch, getState) => {
    await window.ethereum.enable();
    dispatch(loadWallet());
  };
}

export function updateWallet(payload) {
  return {
    type: ACTION_TYPE_UPDATE_WALLET,
    payload,
  };
}

import Promise from 'bluebird';
import { web3, ACTION_TYPE_UPDATE_WALLET } from 'config';

export function loadWallet() {
  return async(dispatch, getState) => {
    dispatch(updateWallet({ isLoaded: false }));

    try {
      if (!web3) {
        throw new Error('You have to install MetaMask!');
      }

      await new Promise((resolve, reject) => {
        web3.eth.getAccounts((err, accounts) => {
          if (err) {
            return reject(err);
          }

          const [account] = accounts;
          if (!account) {
            return reject(new Error('No account was selected'));
          }

          dispatch(updateWallet({ account }));
          resolve();
        });
      });

      await new Promise((resolve, reject) => {
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
        const { contracts, account } = getState().wallet;
        const contract = web3.eth.contract(abi).at(contracts.foamToken);
        contract.balanceOf(account, (err, info) => {
          if (err) {
            return reject(err);
          }
          dispatch(updateWallet({ balance: info.c[0] }));
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

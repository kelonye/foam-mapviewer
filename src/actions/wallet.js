import Promise from 'bluebird';
import { web3, ACTION_TYPE_UPDATE_WALLET } from 'config';
import TOKEN_CONTRACT_ABI from 'data/abis/token';
import REGISTRY_CONTRACT_ABI from 'data/abis/registry';
import xhr from 'utils/xhr';

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

      const contract = web3.eth
        .contract(TOKEN_CONTRACT_ABI.abi)
        .at(contracts.foamToken);

      let account;

      await new Promise((resolve, reject) => {
        web3.eth.getAccounts((err, accounts) => {
          if (err) {
            return reject(err);
          }

          [account] = accounts;
          if (!account) {
            return reject(new Error('No account was selected'));
          }

          dispatch(updateWallet({ account }));

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

      // await new Promise((resolve, reject) => {
      //   contract.allowance(account, contracts.foamRegistry, (err, info) => {
      //     if (err) {
      //       return reject(err);
      //     }
      //     dispatch(updateWallet({ staked: info.c[0] }));
      //     resolve();
      //   });
      // });
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

export function createPOI(fields, { foam }) {
  return async(dispatch, getState) => {
    dispatch(updateWallet({ isLoaded: false }));

    try {
      if (!web3) {
        throw new Error('You have to install MetaMask!');
      }

      const {
        wallet: { contracts },
      } = getState();

      const contract = web3.eth
        .contract(REGISTRY_CONTRACT_ABI.abi)
        .at(contracts.foamRegistry);

      // const ipfsAddress = 'QmZcP8baFoEgQgW6DT3pNiL9u86wgaQbgoQJzZy43CU3E2';
      const ipfsAddress = await xhr('post', '/poi/ipfs', fields);
      const listingHash = web3.sha3(ipfsAddress);
      const amount = foam * 1000000000000000000;
      console.log(listingHash, amount, ipfsAddress);
      await new Promise((resolve, reject) => {
        contract.apply(
          listingHash,
          amount,
          ipfsAddress,
          (err, transactionId) => {
            console.log(err, transactionId);
            resolve();
          }
        );
      });
    } finally {
      dispatch(updateWallet({ isLoaded: true }));
    }
  };
}

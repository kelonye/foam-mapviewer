import Promise from 'bluebird';
import { web3, ACTION_TYPE_UPDATE_WALLET } from 'config';
import { getTokenContract, getRegistryContract } from 'utils/wallet';
import xhr from 'utils/xhr';

export function loadWallet() {
  return async(dispatch, getState) => {
    dispatch(updateWallet({ isLoaded: false }));

    try {
      if (!web3) {
        // throw new Error('You have to install MetaMask!');
        return;
      }

      const {
        wallet: { contracts },
      } = getState();

      const tokenContract = getTokenContract();
      const registryContract = getRegistryContract();

      let staked = 0,
        approved = 0,
        balance = 0,
        poisListed = 0,
        poisChallenged = 0,
        poisPending = 0;
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

      [
        balance,
        approved,
        staked,
        {
          pendingPOIs: poisPending,
          challengedPOIs: poisChallenged,
          verifiedPOIs: poisListed,
        },
      ] = await Promise.all([
        new Promise((resolve, reject) => {
          tokenContract.balanceOf(account, (err, info) => {
            if (err) {
              return reject(err);
            }
            resolve(info.c[0]);
          });
        }),
        new Promise((resolve, reject) => {
          tokenContract.allowance(
            account,
            contracts.foamRegistry,
            (err, info) => {
              if (err) {
                return reject(err);
              }
              resolve(info.c[0]);
            }
          );
        }),

        new Promise((resolve, reject) => {
          registryContract.totalStaked(account, (err, info) => {
            if (err) {
              return reject(err);
            }
            resolve(info.c[0]);
          });
        }),

        xhr('get', `/user/${account}/assets`),
      ]);

      dispatch(
        updateWallet({
          staked,
          approved,
          balance,
          poisListed,
          poisChallenged,
          poisPending,
        })
      );
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

      const contract = getRegistryContract();

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

export function approveFOAM(amount) {
  return async(dispatch, getState) => {
    if (!web3) {
      throw new Error('You have to install MetaMask!');
    }

    const {
      wallet: { contracts },
    } = getState();

    const contract = getTokenContract();

    await new Promise((resolve, reject) => {
      contract.approve(
        contracts.foamRegistry,
        amount * 1000000000000000000,
        (err, transactionId) => {
          console.log(err, transactionId);
          resolve();
        }
      );
    });
  };
}

import Promise from 'bluebird';
import { ACTION_TYPE_UPDATE_WALLET } from 'config';
import { getTokenContract, getRegistryContract } from 'utils/wallet';
import { serializeFoam } from 'utils/foam';
import xhr from 'utils/xhr';

export function loadWallet() {
  return async(dispatch, getState) => {
    try {
      const {
        wallet: { contracts, account },
      } = getState();
      if (!account) return;

      dispatch(updateWallet({ isLoading: true }));

      const tokenContract = getTokenContract();
      const registryContract = getRegistryContract();

      let staked = 0,
        approved = 0,
        balance = 0,
        poisListed = 0,
        poisChallenged = 0,
        poisPending = 0;

      [
        // balance,
        // approved,
        // staked,
        {
          pendingPOIs: poisPending,
          challengedPOIs: poisChallenged,
          verifiedPOIs: poisListed,
        },
      ] = await Promise.all([
        tokenContract.read('balanceOf', [account]),
        // tokenContract.read('allowance', [account, contracts.foamRegistry]),
        // registryContract.read('totalStaked', [account]),
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
      dispatch(updateWallet({ isLoading: false }));
    }
  };
}

export function activateWallet() {
  return async(dispatch, getState) => {
    let account;
    try {
      [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      dispatch(updateAccount(account));
    } catch (e) {
      console.alert('A web3 capable browser is required!');
    }
    if (account) {
      dispatch(updateAccount(account));
      dispatch(loadWallet());
    }
  };
}

export function updateWallet(payload) {
  return {
    type: ACTION_TYPE_UPDATE_WALLET,
    payload,
  };
}

export function updateAccount(account) {
  return async(dispatch, getState) => {
    dispatch(updateWallet({ account }));
  };
}

export function approveFOAM(amount) {
  return async(dispatch, getState) => {
    const {
      wallet: { contracts },
    } = getState();
    await getTokenContract().write(
      'approve',
      [contracts.foamRegistry, serializeFoam(amount)]
    );
  };
}

export function loadWalletApproved(amount) {
  return async(dispatch, getState) => {
    const {
      wallet: { contracts, account },
    } = getState();
    if (!account) return;

    dispatch(
      updateWallet({
        approved: await getTokenContract().read(
          'allowance',
          [account, contracts.foamRegistry]
        ),
      })
    );
  };
}

import Promise from 'bluebird';
import { ACTION_TYPE_UPDATE_WALLET } from 'config';
import {
  WEB3,
  FOAM_TOKEN_DECIMALS,
  getTokenContract,
  getRegistryContract,
} from 'utils/wallet';
import xhr from 'utils/xhr';

export function loadWallet() {
  return async(dispatch, getState) => {
    try {
      const {
        wallet: { contracts, account },
      } = getState();
      if (!account) return;

      dispatch(updateWallet({ isLoaded: false }));

      const tokenContract = getTokenContract();
      const registryContract = getRegistryContract();

      let staked = 0,
        approved = 0,
        balance = 0,
        poisListed = 0,
        poisChallenged = 0,
        poisPending = 0;

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
        tokenContract.read('balanceOf', account),
        tokenContract.read('allowance', account, contracts.foamRegistry),
        registryContract.read('totalStaked', account),
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
      const ipfsAddress = await xhr('post', '/poi/ipfs', fields);
      const listingHash = WEB3.utils.sha3(ipfsAddress);
      const amount = WEB3.utils.toHex(
        new WEB3.utils.BN(foam).mul(FOAM_TOKEN_DECIMALS)
      );

      await getRegistryContract().write(
        'apply',
        listingHash,
        amount,
        ipfsAddress
      );
    } finally {
      dispatch(updateWallet({ isLoaded: true }));
    }
  };
}

export function approveFOAM(amount) {
  return async(dispatch, getState) => {
    const {
      wallet: { contracts },
    } = getState();
    await getTokenContract().write(
      'approve',
      contracts.foamRegistry,
      WEB3.utils.toHex(new WEB3.utils.BN(amount).mul(FOAM_TOKEN_DECIMALS))
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
          account,
          contracts.foamRegistry
        ),
      })
    );
  };
}

import Promise from 'bluebird';
import { ACTION_TYPE_UPDATE_WALLET, ACTION_TYPE_UPDATE_DATA } from 'config';
import { WEB3, getTokenContract, getRegistryContract } from 'utils/wallet';
import { serializeFoam } from 'utils/foam';
import xhr from 'utils/xhr';
import * as threeBox from 'utils/3box';
import { loadPOI } from 'utils/foam';

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
      dispatch(updateWallet({ isLoading: false }));
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

export function updateAccount(account) {
  return async(dispatch, getState) => {
    dispatch(updateWallet({ account }));
  };
}

export function createPOI(fields, { foam }) {
  return async(dispatch, getState) => {
    dispatch(updateData({ isLoadingPlaces: true }));

    try {
      const ipfsAddress = await xhr('post', '/poi/ipfs', fields);
      const listingHash = WEB3.utils.sha3(ipfsAddress);
      const amount = serializeFoam(foam);

      await getRegistryContract().write(
        'apply',
        listingHash,
        amount,
        ipfsAddress
      );
    } finally {
      dispatch(updateData({ isLoadingPlaces: false }));
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
      serializeFoam(amount)
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

export function updateData(payload) {
  return { type: ACTION_TYPE_UPDATE_DATA, payload };
}

export function loadBookmarks() {
  return async(dispatch, getState) => {
    dispatch(updateData({ isLoadingBookmarks: true }));
    const bookmarksMap = await threeBox.loadBookmarks();
    const bookmarksList = await Promise.all(
      Object.keys(bookmarksMap).map(listingHash => loadPOI(listingHash))
    );
    dispatch(
      updateData({ bookmarksList, bookmarksMap, isLoadingBookmarks: false })
    );
  };
}

export function toggleBookmark(listingHash, poi) {
  return async(dispatch, getState) => {
    const bookmarksMap = Object.assign({}, getState().map.bookmarksMap);
    const adding = !bookmarksMap[listingHash];
    if (adding) {
      bookmarksMap[listingHash] = true;
    } else {
      delete bookmarksMap[listingHash];
    }
    await threeBox.saveBookmarks(bookmarksMap);
    const bookmarksList = Object.values(bookmarksMap);
    if (adding) {
      bookmarksList.push(poi);
    }
    dispatch(updateData({ bookmarksMap, bookmarksList }));
  };
}

import { WEB3 } from 'utils/wallet';
import xhr from 'utils/xhr';
import Geohash from 'latlon-geohash';

export const FOAM_TOKEN_DECIMALS = new WEB3.utils.BN('1000000000000000000');

export function deserializeFoam(foam) {
  return WEB3.utils
    .toBN(foam)
    .div(FOAM_TOKEN_DECIMALS)
    .toNumber();
}

export function serializeFoam(amount) {
  return WEB3.utils.toHex(new WEB3.utils.BN(amount).mul(FOAM_TOKEN_DECIMALS));
}

export async function loadPOI(listingHash) {
  const {
    data: {
      data,
      state: { deposit },
    },
  } = await xhr('get', `/poi/${listingHash}`);
  data.foam = deserializeFoam(deposit);
  data.listingHash = listingHash;
  return data;
}

export function parsePOI(poi) {
  const {
    listingHash,
    owner,
    geohash,
    name,
    tags: ptags,
    state: {
      status: { type: status },
      deposit,
    },
  } = poi;
  return {
    listingHash,
    owner,
    name,
    status,
    foam: deserializeFoam(deposit),
    tags: ptags,
    ...Geohash.decode(geohash),
  };
}
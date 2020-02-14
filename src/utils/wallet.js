import { web3 } from 'config';
import foamToken from 'data/abis/token';
import foamRegistry from 'data/abis/registry';
import store from 'store';

const ABIS = {
  foamToken,
  foamRegistry,
};

export function getTokenContract() {
  return getContract('foamToken');
}

export function getRegistryContract() {
  return getContract('foamRegistry');
}

function getContract(contractType) {
  return web3.eth
    .contract(ABIS[contractType].abi)
    .at(store.getState().wallet.contracts[contractType]);
}

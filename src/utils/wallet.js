import Promise from 'bluebird';
import foamToken from 'data/abis/token';
import foamRegistry from 'data/abis/registry';
import store from 'utils/store';
import Web3 from 'web3';

export const WEB3 = (window.WEB3 = (() => {
  // Modern dapp browsers...
  if (window.ethereum) {
    return new Web3(window.ethereum);
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    console.log(
      'Non-Ethereum browser detected. You should consider trying MetaMask!'
    );
    return new Web3(
      new Web3.providers.HttpProvider(
        'https://mainnet.infura.io/v3/90b4177113144a0c82b2b64bc01950e1'
      )
    );
  }
})());

const ABIS = {
  foamToken,
  foamRegistry,
};

export class Contract {
  constructor(contractType) {
    this.contract = this.getContract(contractType);
  }

  getContract(contractType) {
      const json = ABIS[contractType];
      return new WEB3.eth.Contract(
          json.abi,
          store.getState().wallet.contracts[contractType]
      );
  }
  
  async read(method, args = [], options = {}) {
    return this.callContract(false, method, args, options);
  }

  async write(method, args = [], options = {}) {
    return this.callContract(true, method, args, options);
  }

  async callContract(write, method, args) {
    return new Promise((resolve, reject) => {
      const options = {};
      const {
          wallet: { account },
      } = store.getState();
      if (account) {
        options.from = account;
      }
      this.contract.methods[method](...args)[write ? 'send' : 'call'](
        options,
        (err, response) => {
          if (err) {
            return reject(new Error(err.message));
          }
          if (response.c && response.c.length) {
            return resolve(response.c);
          }
          resolve(response);
          // resolve(response.c?.[0] ?? response);
        }
      );
    });
  }

  on(eventName, fn) {
    return this.contract.events[eventName]({}, fn);
  }
}

export function getTokenContract() {
  return new Contract('foamToken');
}

export function getRegistryContract() {
  return new Contract('foamRegistry');
}

import Promise from 'bluebird';
import foamToken from 'data/abis/token';
import foamRegistry from 'data/abis/registry';
import store from 'utils/store';
import Web3 from 'web3';

export const WEB3 = new Web3(
  typeof window.web3 !== 'undefined'
    ? window.web3.currentProvider
    : new Web3.providers.HttpProvider(
        'https://mainnet.infura.io/v3/90b4177113144a0c82b2b64bc01950e1'
      )
);
window.WEB3 = WEB3;

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

  async read(method, ...args) {
    return this.callContract(false, method, ...args);
  }

  async write(method, ...args) {
    return this.callContract(true, method, ...args);
  }

  async callContract(write, method, ...args) {
    return new Promise((resolve, reject) => {
      const writeOpts = {};
      if (write) {
        const {
          wallet: { account },
        } = store.getState();
        writeOpts.from = account;
      }
      this.contract.methods[method](...args)[write ? 'send' : 'call'](
        ...(write ? [writeOpts] : []),
        (err, response) => {
          if (err) return reject(err);
          resolve(response.c?.[0] ?? response);
        }
      );
    });
  }

  on(eventName, fn) {
    this.contract.events[eventName]({}, fn);
  }
}

export function getTokenContract() {
  return new Contract('foamToken');
}

export function getRegistryContract() {
  return new Contract('foamRegistry');
}

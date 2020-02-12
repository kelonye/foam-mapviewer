import xhr from 'utils/xhr';

export default Base =>
  class extends Base {
    async loadUser() {}

    async loadContracts() {
      this.state.wallet.contracts = await xhr('get', '/config/contracts');
    }
  };

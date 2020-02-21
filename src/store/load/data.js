import xhr from 'utils/xhr';
import { WEB3 } from 'utils/wallet';

export default Base =>
  class extends Base {
    async loadData() {
      try {
        this.state.wallet.contracts = await xhr('get', '/config/contracts');
        this.state.wallet.account = (await WEB3.eth.getAccounts())[0];
      } catch (error) {
        console.log(error);
      }
    }
  };

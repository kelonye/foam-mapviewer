import compose from 'utils/compose';
import LoadData from './data';
import MatchLocationPath from './match-location-path';

class Init {
  async load(getState) {
    this.state = getState();

    try {
      await this.loadData();
    } catch (error) {
      this.state.app.error = error;
    }

    this.state.app.isLoaded = true;

    await this.loadContracts();
    await this.matchLocationPath();

    return this.state;
  }
}

class Store extends compose([Init, LoadData, MatchLocationPath]) {}

export default new Store();

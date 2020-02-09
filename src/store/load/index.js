import compose from 'utils/compose';
import LoadUser from './user';

class Init {
  async load(getState) {
    this.state = getState();

    try {
      await this.loadUser();
    } catch (error) {
      this.state.app.error = error;
    }

    this.state.app.isLoaded = true;

    return this.state;
  }
}

class Store extends compose([Init, LoadUser]) {}

export default new Store();

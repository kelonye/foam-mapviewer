import 'nprogress/nprogress.css';
import './styles';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import store from 'utils/store';
import {completeBootLoader, watchIsMobileChanges, watchWeb3Changes} from 'utils/boot';

import App from 'components/App';

(async() => {
  completeBootLoader();
  watchIsMobileChanges();
  watchWeb3Changes();
  // enableNotifications();
  // watchGeoLocation();

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();

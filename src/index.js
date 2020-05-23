import 'nprogress/nprogress.css';
import './styles';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import store from 'utils/store';
import * as actions from 'actions';
import App from 'components/App';

(async () => {
  document.documentElement.classList.remove('anim-loading');
  document.getElementById('loader-container').remove();
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);

  store.dispatch({ type: 'noop' }); // required for some reason ??
  window.addEventListener('resize', () =>
    store.dispatch(actions.updateIsMobile())
  );

  if (window.ethereum?.on) {
    window.ethereum.on('chainChanged', () => {
      document.location.reload();
    });
    window.ethereum.on('accountsChanged', function(accounts) {
      store.dispatch(actions.updateAccount(accounts[0]));
    });
  }

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

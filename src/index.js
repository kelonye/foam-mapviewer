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
  completeBootLoader();
  watchIsMobileChanges();
  watchWeb3Changes();
  enableNotifications();

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

function completeBootLoader() {
  document.documentElement.classList.remove('anim-loading');
  document.getElementById('loader-container').remove();
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
}

function watchIsMobileChanges() {
  store.dispatch({ type: 'noop' }); // required for some reason ??
  window.addEventListener('resize', () =>
    store.dispatch(actions.updateIsMobile())
  );
}

function watchWeb3Changes() {
  if (window.ethereum?.on) {
    window.ethereum.on('chainChanged', () => {
      document.location.reload();
    });
    window.ethereum.on('accountsChanged', function(accounts) {
      store.dispatch(actions.updateAccount(accounts[0]));
    });
  }
}

function enableNotifications() {
  // function to actually ask the permissions
  function handlePermission(permission) {
    // Whatever the user answers, we make sure Chrome stores the information
    if (!('permission' in Notification)) {
      Notification.permission = permission;
    }

    console.log(Notification.permission);

    if (Notification.permission === 'granted') {
      const img = '/to-do-notifications/img/icon-128.png';
      const text = 'HEY! Your task is now overdue.';
      const notification = new Notification('To do list', {
        body: text,
        icon: img,
      });
    }

    // // set the button to shown or hidden, depending on what the user answers
    // if(Notification.permission === 'denied' || Notification.permission === 'default') {
    //   notificationBtn.style.display = 'block';
    // } else {
    //   notificationBtn.style.display = 'none';
    // }
  }

  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
  } else {
    // if(checkNotificationPromise()) {
    //   Notification.requestPermission()
    //   .then((permission) => {
    //     handlePermission(permission);
    //   })
    // } else {
    Notification.requestPermission(function(permission) {
      handlePermission(permission);
    });
    // }
  }
}

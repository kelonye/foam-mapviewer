import store from 'utils/store';
import * as actions from 'actions';

export function completeBootLoader() {
    document.documentElement.classList.remove('anim-loading');
    document.getElementById('loader-container').remove();
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  }
  
  export function watchIsMobileChanges() {
    store.dispatch({ type: 'noop' }); // required for some reason ??
    window.addEventListener('resize', () =>
      store.dispatch(actions.updateIsMobile())
    );
  }
  
  export function watchWeb3Changes() {
    if (window.ethereum?.on) {
      window.ethereum.on('chainChanged', () => {
        // document.location.reload();
      });
      window.ethereum.on('accountsChanged', function(accounts) {
        const account = accounts[0];
        store.dispatch(actions.updateAccount(account));
        store.dispatch(actions.loadBookmarks(true));
      });
    }

    store.dispatch(actions.loadBookmarks(true));
  }
  
  export function enableNotifications() {
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
        console.log(notification);
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
  
  export function watchGeoLocation() {
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };
  
    const id = navigator.geolocation.watchPosition(success, error, options);
  
    function success(pos) {
      const crd = pos.coords;
  
      console.log(id, crd);
      // navigator.geolocation.clearWatch(id);
    }
  
    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }
  }
  
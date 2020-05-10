import React from 'react';
import T1Icon from '@material-ui/icons/Explore';
import T2Icon from '@material-ui/icons/Map';
import T3Icon from '@material-ui/icons/Search';
import T4Icon from '@material-ui/icons/AccountBalanceWallet';
import { Rnd } from 'react-rnd';
import { Route, Switch, Link } from 'react-router-dom';

import Layers from 'components/Drawer/DrawerLayers';
import Wallet from 'components/Drawer/DrawerWallet/DrawerWallet';
// import Welcome from 'components/Drawer/DrawerWelcome';
import AddPOI from 'components/Drawer/DrawerAddPOI';
import ViewPOI from 'components/Drawer/DrawerViewPOI';

const TABS = [
  { label: 'Near Me', Icon: T1Icon, link: '/layers' },
  { label: 'My Places', Icon: T2Icon, link: '/layers' },
  { label: 'Search', Icon: T3Icon, link: '/layers' },
  { label: 'Wallet', Icon: T4Icon, link: '/wallet' },
];

export default function({ amount }) {
  const [y, setY] = React.useState(200);

  return (
    <div>
      <Rnd
        style={{
          background: 'rgb(52, 51, 51)',
          boxShadow: 'rgba(0, 0, 0, 0.8) 0px 0px 10px',
        }}
        default={{
          x: 0,
          y: 200,
          width: 320,
          height: 200,
        }}
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        dragAxis={'y'}
        size={{ width: '100%', height: window.outerHeight - y }}
        position={{ x: 0, y }}
        onDrag={(e, { y }) => {
          setY(y);
        }}
      >
        <Switch>
          <Route path={'/layers'} component={Layers} />
          <Route path={'/wallet'} component={Wallet} />
          <Route path={'/add-poi/:lng/:lat'} component={AddPOI} />
          <Route path={'/poi/:listingHash'} component={ViewPOI} />
          {/*<Route path={'/'} component={Welcome} />*/}
        </Switch>
      </Rnd>

      <div className="footer flex flex-grow">
        {TABS.map(({ label, Icon, link }) => (
          <Link
            to={link}
            className="flex flex--column flex--grow flex--justify-center flex--align-center"
            key={label}
            style={{ color: 'white' }}
          >
            <div>{<Icon />}</div>
            <div>{label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

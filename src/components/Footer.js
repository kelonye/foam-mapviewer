import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { withRouter } from 'react-router-dom';
import T1Icon from '@material-ui/icons/Explore';
import T2Icon from '@material-ui/icons/Map';
import T3Icon from '@material-ui/icons/Bookmarks';
import T4Icon from '@material-ui/icons/AccountBalanceWallet';
import { Rnd } from 'react-rnd';
import { Route, Switch, Link } from 'react-router-dom';
import clsx from 'clsx';

import Welcome from 'components/Drawer/DrawerWelcome/DrawerWelcome';
import Places from 'components/Drawer/DrawerPlaces/DrawerPlaces';
import PlacesFilterSort from 'components/Drawer/DrawerPlaces/DrawerPlacesFilterSort';
import MyPlaces from 'components/Drawer/DrawerMyPlaces/DrawerMyPlaces';
import Bookmarks from 'components/Drawer/DrawerBookmarks/DrawerBookmarks';
import Wallet from 'components/Drawer/DrawerWallet/DrawerWallet';
import AddPOI from 'components/Drawer/DrawerAddPOI/DrawerAddPOI';
import ViewPOI from 'components/Drawer/DrawerViewPOI/DrawerViewPOI';

const TABS = [
  { label: 'Near Me', Icon: T1Icon, link: '/places' },
  { label: 'My Places', Icon: T2Icon, link: '/my-places' },
  { label: 'Bookmarks', Icon: T3Icon, link: '/bookmarks' },
  { label: 'Wallet', Icon: T4Icon, link: '/wallet' },
];

const DEFAULT_Y = 200;
const H = window.outerHeight;
const W = window.outerWidth;

function Component({ amount }) {
  const [y, setY] = React.useState(DEFAULT_Y);

  return (
    <div>
      <Rnd
        className="footer-drawer drawer"
        default={{
          x: 0,
          y: DEFAULT_Y,
          width: W,
          height: H - DEFAULT_Y,
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
        size={{ width: '100%', height: H - y }}
        position={{ x: 0, y }}
        onDrag={(e, { y }) => {
          setY(y);
          // setY(y < 0 ? 0 : y);
        }}
      >
        <Switch>
          <Route exact path={'/places'} component={Places} />
          <Route
            exact
            path={'/places/filter+sort'}
            component={PlacesFilterSort}
          />
          <Route exact path={'/my-places'} component={MyPlaces} />
          <Route exact path={'/bookmarks'} component={Bookmarks} />
          <Route path={'/wallet'} component={Wallet} />
          <Route exact path={'/add-poi/:lng/:lat'} component={AddPOI} />
          <Route exact path={'/poi/:listingHash'} component={ViewPOI} />
          <Route path={'/'} component={Welcome} />
        </Switch>
      </Rnd>

      <div className="footer flex flex-grow">
        {TABS.map(({ label, Icon, link }) => (
          <Link
            to={link}
            className={clsx(
              'flex flex--column flex--grow flex--justify-center flex--align-center',
              { active: ~window.location.pathname.search(link) }
            )}
            key={label}
          >
            <div>{<Icon />}</div>
            <div>{label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default withRouter(
  connect(state => {
    return {};
  }, mapDispatchToProps)(Component)
);

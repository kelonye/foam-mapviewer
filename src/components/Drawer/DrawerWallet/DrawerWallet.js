import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';
import RequireAccount from 'components/RequireAccount';
import Summary from './DrawerWalletSummary';
import Registry from './DrawerWalletRegistry';
import Voting from './DrawerWalletVoting';
import Signaling from './DrawerWalletSignaling';
import { history } from 'utils/store';

const useStyles = makeStyles(theme => ({
  tab: {
    minWidth: 'auto',
    padding: 7,
    fontSize: 13,
    width: '25%',
  },
  activeTabContent: {
    paddingTop: 20,
  },
}));

const ROUTES = ['/', '/registry', '/voting', '/signaling'];
const ROUTE_COMPONENTS = [Summary, Registry, Voting, Signaling];
const ROUTE_LABELS = ['Summary', 'Registry', 'Voting', 'Signaling'];

const Component = ({ loadWallet, account, path, showDrawer, match }) => {
  const classes = useStyles();
  let activeTab = ROUTES.indexOf(path);
  activeTab = -1 === activeTab ? 0 : activeTab;

  // console.log(activeTab, path);

  const handleActiveTabChange = (event, newValue) => {
    history.push(`/wallet${newValue ? ROUTES[newValue] : ''}`);
  };

  React.useEffect(
    function() {
      loadWallet();
      showDrawer(match.params.url);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadWallet, account]
  );

  return (
    <div className={classes.container}>
      <h4 className="drawer__title">Wallet</h4>
      <div className="drawer__content">
        <RequireAccount>
          <Tabs
            value={activeTab}
            indicatorColor="primary"
            textColor="inherit"
            onChange={handleActiveTabChange}
            aria-label="tabs"
          >
            {ROUTE_LABELS.map(label => (
              <Tab className={classes.tab} key={label} {...{ label }} />
            ))}
          </Tabs>

          <div className={classes.activeTabContent}>
            <Switch>
              {ROUTES.map((path, i) => (
                <Route
                  exact
                  key={path}
                  path={`/wallet${ROUTES[i]}`}
                  component={ROUTE_COMPONENTS[i]}
                />
              ))}
            </Switch>
          </div>
        </RequireAccount>
      </div>
    </div>
  );
};

export default connect(({ wallet }, { match }) => {
  return {
    path: window.location.pathname.replace('/wallet', ''),
  };
}, mapDispatchToProps)(Component);

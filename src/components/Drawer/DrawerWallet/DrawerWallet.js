import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button, Tabs, Tab } from '@material-ui/core';
import Loader from 'components/Loader';
import { makeStyles } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';
import Summary from './DrawerWalletSummary';
import Registry from './DrawerWalletRegistry';
import Voting from './DrawerWalletVoting';
import Signaling from './DrawerWalletSignaling';
import { history } from 'store';

const useStyles = makeStyles(theme => ({
  metaMaskButton: {
    backgroundColor: '#f5841f',
    boxShadow: 'none',
    borderBottom: 'solid 4px #763e1a',
    color: '#763e1a',
    '&:hover': {
      backgroundColor: '#f5841f',
    },
  },
  tab: {
    minWidth: 'auto',
    padding: 7,
  },
  activeTabContent: {
    paddingTop: 20,
  },
}));

const ROUTES = ['/', '/registry', '/voting', '/signaling'];
const ROUTE_COMPONENTS = [Summary, Registry, Voting, Signaling];
const ROUTE_LABELS = ['Summary', 'Registry', 'Voting', 'Signaling'];

const Component = ({ isLoaded, loadWallet, account, activateWallet, path }) => {
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
    },
    [loadWallet]
  );

  return (
    <div>
      <h4 className="drawer--title">Wallet</h4>
      <div className="drawer--content">
        {!isLoaded ? (
          <Loader fullscreen={false} />
        ) : account ? (
          <div>
            <Tabs
              value={activeTab}
              indicatorColor="primary"
              textColor="primary"
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
          </div>
        ) : (
          <div>
            <Button
              variant="contained"
              onClick={activateWallet}
              className={classes.metaMaskButton}
              fullWidth
            >
              Connect to MetaMask
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(({ wallet }, { match }) => {
  return {
    ...wallet,
    path: window.location.pathname.replace('/wallet', ''),
  };
}, mapDispatchToProps)(Component);

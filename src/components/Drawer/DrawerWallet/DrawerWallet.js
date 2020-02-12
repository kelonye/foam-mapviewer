import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button, Tabs, Tab } from '@material-ui/core';
import Loader from 'components/Loader';
import { makeStyles } from '@material-ui/core/styles';
import Summary from './DrawerWalletSummary';
import Registry from './DrawerWalletRegistry';
import Voting from './DrawerWalletVoting';
import Signaling from './DrawerWalletSignaling';

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

const TAB_COMPONENTS = [Summary, Registry, Voting, Signaling];

const Component = ({ isLoaded, loadWallet, account, activateWallet }) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = React.useState(0);
  const ActiveTabContent = TAB_COMPONENTS[activeTab];
  const handleActiveTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
              <Tab className={classes.tab} label="Summary" />
              <Tab className={classes.tab} label="Registry" />
              <Tab className={classes.tab} label="Voting" />
              <Tab className={classes.tab} label="Signaling" />
            </Tabs>

            <div className={classes.activeTabContent}>
              <ActiveTabContent />
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

export default connect(({ wallet }) => {
  return {
    ...wallet,
  };
}, mapDispatchToProps)(Component);

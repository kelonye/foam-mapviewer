import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Route, Switch } from 'react-router-dom';
import TopUp from './ModalTopUp';
import ChallengePOI from './ModalChallengePOI';

function Component({ goHome }) {
  const handleClose = () => {
    goHome();
  };

  return (
    <div>
      <Switch>
        <Route
          path={'/top-up'}
          render={props => <TopUp {...props} {...{ handleClose }} />}
        />
        <Route
          path={'/poi/:listingHash/challenge'}
          render={props => <ChallengePOI {...props} {...{ handleClose }} />}
        />
      </Switch>
    </div>
  );
}

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

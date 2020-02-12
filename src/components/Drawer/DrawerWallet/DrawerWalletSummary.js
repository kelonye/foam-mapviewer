import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import FOAM from 'components/FOAM';

const Component = ({ balance, account }) => {
  return (
    <div className="flex flex--column">
      <strong>{account}</strong>
      <div>
        FOAM Staked in POIs: <FOAM amount={balance} />
      </div>
      {/*<button onClick={deactivateWallet}>disconnect</button>*/}
    </div>
  );
};

export default connect(({ wallet }) => {
  return {
    ...wallet,
  };
}, mapDispatchToProps)(Component);

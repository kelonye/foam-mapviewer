import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';

const Component = () => {
  return (
    <div>
      <h4 className="drawer--title">Wallet</h4>
      <div className="drawer--content"></div>
    </div>
  );
};

export default connect(() => {
  return {};
}, mapDispatchToProps)(Component);

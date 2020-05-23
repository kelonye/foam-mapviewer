import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';

const Component = () => {
  return <div>WIP</div>;
};

export default connect(({ wallet }) => {
  return {
    ...wallet,
  };
}, mapDispatchToProps)(Component);

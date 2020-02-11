import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import Button from './MenuButton';

class Component extends React.Component {
  onClick(event) {
    const { hideDrawer } = this.props;
    hideDrawer();
  }

  render() {
    return <Button {...this.props} onClick={e => this.onClick(e)} />;
  }
}

export default connect(state => {
  const { drawer } = state;
  return {
    drawerType: drawer.type,
  };
}, mapDispatchToProps)(Component);

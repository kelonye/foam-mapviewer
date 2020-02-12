import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { HEADER_HEIGHT, MENU_WIDTH } from 'config';
import map from 'map';

class Component extends React.Component {
  componentDidMount() {
    map.render(this.mapEl);
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="map"
          style={{ top: HEADER_HEIGHT, left: MENU_WIDTH }}
          ref={el => (this.mapEl = el)}
        ></div>
      </React.Fragment>
    );
  }
}

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

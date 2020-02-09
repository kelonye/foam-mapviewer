import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Popup } from 'react-map-gl';

class Component extends React.PureComponent {
  render() {
    const { pt, onClose } = this.props;
    return !pt ? null : (
      <Popup
        tipSize={5}
        anchor="top"
        longitude={pt.lon}
        latitude={pt.lat}
        closeOnClick={false}
        onClose={onClose}
      >
        <div>{pt.name}</div>
      </Popup>
    );
  }
}

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

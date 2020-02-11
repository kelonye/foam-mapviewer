import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Popup } from 'react-map-gl';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, newState) {
    return this.props.pt !== nextProps.pt;
  }

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
        <div className="flex flex--column">
          <div>{pt.name}</div>
          <div>
            {pt.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  marginRight: 5,
                  borderRadius: 10,
                  padding: '3px 7px',
                  background: '#eee',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Popup>
    );
  }
}

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

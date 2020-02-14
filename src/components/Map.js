import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { HEADER_HEIGHT } from 'config';
import map from 'map';
import { widthSelector } from 'selectors/menu';

class Component extends React.Component {
  componentDidMount() {
    map.render(this.mapEl);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.left !== this.props.left) {
      map.map.resize();
    }
  }

  render() {
    const { left } = this.props;
    return (
      <div
        className="map"
        style={{
          top: HEADER_HEIGHT,
          left,
          height: `calc(100% - ${HEADER_HEIGHT}px)`,
          width: `calc(100% - ${left}px)`,
        }}
        ref={el => (this.mapEl = el)}
      ></div>
    );
  }
}

export default connect(state => {
  return {
    left: widthSelector(state),
  };
}, mapDispatchToProps)(Component);

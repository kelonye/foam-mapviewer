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
    if (prevProps.isMobile !== this.props.isMobile) {
      setTimeout(() => map.map.resize(), 301);
    }
  }

  render() {
    const { left, isMobile } = this.props;
    return (
      <div
        className="map"
        style={{
          top: HEADER_HEIGHT,
          left: isMobile ? 0 : left,
          height: `calc(100% - ${HEADER_HEIGHT}px)`,
          ...(isMobile ? {} : { width: `calc(100% - ${left}px)` }),
        }}
        ref={el => (this.mapEl = el)}
      ></div>
    );
  }
}

export default connect(state => {
  const { isMobile } = state.app;
  return {
    left: widthSelector(state),
    isMobile,
  };
}, mapDispatchToProps)(Component);

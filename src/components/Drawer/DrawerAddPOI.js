import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';

const Component = ({ lat, lng }) => {
  return (
    <div>
      <h4 className="drawer--title">Add Point of Interest</h4>
      <div className="drawer--content flex flex--column">
        Lat: {lat}
        <br />
        Lng:{lng}
      </div>
    </div>
  );
};

export default connect((_, { match: { params: { lat, lng } } }) => {
  return { lat, lng };
}, mapDispatchToProps)(Component);

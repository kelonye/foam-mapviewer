import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const Component = () => {
  return (
    <div>
      <h4 className="drawer__title">Welcome Cartographer!</h4>
      <div className="drawer__content">
        <p>
          On the FOAM Map, you create, curate, and search a consensus-driven
          map. Cartographers sort and verify Places, such as landmarks,
          businesses, and tourist attractions. Anyone can search the FOAM Map
          and discover places ranked the highest.
        </p>

        <h3>Get started</h3>
        <p>
          Click below to start exploring places already registered near you!
        </p>
        <Link to={'/places'}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Explore places
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default connect(() => {
  return {};
}, mapDispatchToProps)(Component);

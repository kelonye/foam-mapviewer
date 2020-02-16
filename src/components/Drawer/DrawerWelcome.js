import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const Component = () => {
  return (
    <div>
      <h4 className="drawer--title">Welcome Cartographer!</h4>
      <div className="drawer--content">
        <p>
          On the FOAM Map, you create, curate, and search a consensus-driven
          map. Cartographers sort and verify points of interest, such as
          landmarks, businesses, and tourist attractions. Anyone can search the
          FOAM Map and discover places ranked the highest.
        </p>

        <h3>First things first</h3>
        <p>Our guide covers everything you need to start using the FOAM Map.</p>
        <Link to="https://mapguide.foam.space/en/">
          <Button variant="outlined" color="secondary" type="submit" fullWidth>
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default connect(() => {
  return {};
}, mapDispatchToProps)(Component);

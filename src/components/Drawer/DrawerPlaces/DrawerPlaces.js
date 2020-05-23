import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Loader from 'components/Loader';
import { poisInViewSelector } from 'selectors/map';
import { Link } from 'react-router-dom';
import POI from 'components/Drawer/DrawerPOI';

const useStyles = makeStyles(theme => ({}));

const Component = ({ isLoading, pois, showDrawer, match }) => {
  const classes = useStyles();

  React.useEffect(
    () => {
      showDrawer(match.params.url);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <div className={classes.container}>
      <div className="drawer__title flex flex--align-center">
        <div className="flex--grow">Places in View</div>

        <Link to={'/places/filter+sort'}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="small"
          >
            sort / filter
          </Button>
        </Link>
      </div>
      <div className="drawer__content">
        {isLoading ? (
          <Loader />
        ) : !pois.length ? (
          <div className="flex flex--column flex--align-center">
            No places found.
          </div>
        ) : (
          <div>
            {pois.map(poi => (
              <div key={poi.listingHash}>
                <POI poi={poi} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(state => {
  const {
    map: {
      poisInView: { isLoading },
    },
  } = state;
  return {
    pois: poisInViewSelector(state),
    isLoading,
  };
}, mapDispatchToProps)(Component);

import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
// import { Link } from 'react-router-dom';
import Loader from 'components/Loader';
import RequireAccount from 'components/RequireAccount';
import { myPOIsSelector } from 'selectors/map';
import POI from 'components/Drawer/DrawerPOI';

const useStyles = makeStyles(theme => ({}));

const Component = ({
  isLoading,
  pois,
  showDrawer,
  match,
  loadMyPOIs,
  setIsAddingPOI,
}) => {
  const classes = useStyles();

  React.useEffect(
    () => {
      showDrawer(match.params.url);
      loadMyPOIs();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={classes.container}>
      <div className="drawer__title flex flex--align-center">
        <div className="flex--grow">My Places</div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="small"
          onClick={() => setIsAddingPOI(true)}
        >
          + register
        </Button>
        {/* 
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
        */}
      </div>
      <div className="drawer__content">
        <RequireAccount>
          {isLoading ? (
            <Loader />
          ) : !pois.length ? (
            <div className="flex flex--column flex--align-center">
              You haven't registered any places.
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="small"
                onClick={() => setIsAddingPOI(true)}
              >
                + register new place
              </Button>
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
        </RequireAccount>
      </div>
    </div>
  );
};

export default connect(state => {
  const {
    map: {
      myPOIs: { isLoading },
    },
  } = state;
  return {
    pois: myPOIsSelector(state),
    isLoading,
  };
}, mapDispatchToProps)(Component);

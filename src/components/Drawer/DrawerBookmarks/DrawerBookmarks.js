import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import Loader from 'components/Loader';
import POI from 'components/Drawer/DrawerPOI';
import RequireAccount from 'components/RequireAccount';
import { bookmarksSelector } from 'selectors/map';

const useStyles = makeStyles(theme => ({}));

const Component = ({ isLoading, bookmarks, showDrawer, match }) => {
  const classes = useStyles();

  React.useEffect(
    function() {
      showDrawer(match.params.url);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={classes.container}>
      <h4 className="drawer__title">Saved Places</h4>
      <div className="drawer__content">
        <RequireAccount>
          {isLoading ? (
            <Loader />
          ) : !bookmarks.length ? (
            <div className="text-center">No bookmarks found</div>
          ) : (
            <div>
              {bookmarks.map(poi => (
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
      bookmarks: { isLoading },
    },
  } = state;
  return { bookmarks: bookmarksSelector(state), isLoading };
}, mapDispatchToProps)(Component);

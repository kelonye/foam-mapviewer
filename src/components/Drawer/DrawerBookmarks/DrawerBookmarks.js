import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import Loader from 'components/Loader';
import POI from 'components/Drawer/DrawerPOI';

const useStyles = makeStyles(theme => ({}));

const Component = ({
  isLoading,
  account,
  bookmarksList,
  loadBookmarks,
  showDrawer,
  match,
}) => {
  const classes = useStyles();

  React.useEffect(
    function() {
      showDrawer(match.params.url);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // React.useEffect(
  //   function() {
  //     loadBookmarks();
  //   [loadBookmarks, account] // eslint-disable-line react-hooks/exhaustive-deps
  // );

  return (
    <div className={classes.container}>
      <h4 className="drawer__title">Saved Places</h4>
      <div className="drawer__content">
        {isLoading ? (
          <Loader />
        ) : !bookmarksList.length ? (
          <div className="text-center">No bookmarks found</div>
        ) : (
          <div>
            {bookmarksList.map(poi => (
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

export default connect(
  ({ map: { bookmarksList, isLoadingBookmarks: isLoading } }) => {
    return { bookmarksList, isLoading };
  },
  mapDispatchToProps
)(Component);

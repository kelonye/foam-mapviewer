import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Typography, Chip, Button } from '@material-ui/core';
import { loadPOI } from 'utils/foam';
import sl from 'utils/sl';
import Geohash from 'latlon-geohash';
import { Link } from 'react-router-dom';
import Loader from 'components/Loader';
import Close from 'components/Drawer/DrawerClose';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 0,
  },
  title: {
    marginBottom: 10,
    fontSize: 13,
    fontWeight: 'bolder',
  },
  listItem: {
    padding: 0,
  },
  paper: {
    marginBottom: 10,
    padding: '10px 10px 0',
  },
  chip: {
    marginBottom: 5,
    marginRight: 5,
  },
  link: {
    color: 'white',
    '&:hover': {
      opacity: 0.8,
    },
  },
  footer: {
    marginTop: 20,
  },
  footerBtn: {
    marginBottom: 15,
  },
}));

const Component = ({
  match: {
    params: { url, listingHash },
  },
  account,
  showDrawer,
  toggleBookmark,
  isBookmarked,
  loadedPOI,
}) => {
  const classes = useStyles();
  const [poi, setPOI] = React.useState(loadedPOI || {});
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    name,
    address,
    status,
    description,
    phone,
    web,
    geohash,
    tags = [],
    foam,
  } = poi;

  const onMount = async() => {
    if (!loadedPOI) {
      setIsLoading(true);
      setPOI(await loadPOI(listingHash));
      setIsLoading(false);
    }
  };

  React.useEffect(
    () => {
      onMount();
    },
    [listingHash, loadPOI] // eslint-disable-line react-hooks/exhaustive-deps
  );

  React.useEffect(() => {
    showDrawer(url);
  }, [showDrawer]); // eslint-disable-line react-hooks/exhaustive-deps

  const onToggleBookmark = async() => {
    await toggleBookmark({ ...poi, listingHash });
    sl(
      'success',
      isBookmarked
        ? 'Successfully removed place from bookmarks'
        : 'Successfully added the place to your bookmarks.'
    );
  };

  const { lon, lat } = !geohash ? {} : Geohash.decode(geohash);

  const info = [
    !name ? null : ['Name', name],
    _.isNil(foam) ? null : ['Foam', foam],
    !address ? null : ['Address', address],
    !status ? null : ['Status', status],
    !phone
      ? null
      : [
          'Phone',
          <a href={`tel:${phone}`} className={classes.link}>
            {phone}
          </a>,
        ],
    !web
      ? null
      : [
          'Website',
          <a
            href={web}
            target="_blank"
            className={classes.link}
            rel="noreferrer noopener"
          >
            {web}
          </a>,
        ],
    !geohash
      ? null
      : [
          'Location',
          <div>
            Longitude: {lon}
            <br />
            Latitude: {lat}
          </div>,
        ],
    !tags.length
      ? null
      : [
          'Tags',
          tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              color="default"
              className={classes.chip}
            />
          )),
        ],
    !description ? null : ['Description', description],
  ].filter(x => !!x);

  return (
    <div>
      <Close goBack />
      <h4 className="drawer__title drawer__title--padded">Point of Interest</h4>
      <div className="drawer__content">
        {isLoading ? (
          <Loader />
        ) : (
          <React.Fragment>
            {info.map(([k, v]) => (
              <div key={k} elevation={0} className={classes.paper}>
                <Typography variant="h6" className={classes.title}>
                  {k}
                </Typography>

                <div>{v}</div>
              </div>
            ))}

            <div className={clsx('flex', 'flex--column', classes.footer)}>
              <div className={classes.footerBtn}>
                <Button variant="contained" color="primary" fullWidth>
                  Get Directions
                </Button>
              </div>

              <div className={classes.footerBtn}>
                <Button
                  variant="contained"
                  color="default"
                  onClick={onToggleBookmark}
                  fullWidth
                >
                  {isBookmarked ? 'Unbookmark' : 'Bookmark'}
                </Button>
              </div>

              <div className={classes.footerBtn}>
                <Link to={!account ? '#' : `/poi/${listingHash}/challenge`}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    disabled={!account}
                  >
                    Challenge
                  </Button>
                </Link>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default connect(
  (
    { wallet: { account }, map: { bookmarksMap, poisByListingHash } },
    {
      match: {
        params: { listingHash },
      },
    }
  ) => {
    return {
      account,
      isBookmarked: bookmarksMap[listingHash],
      loadedPOI: poisByListingHash[listingHash],
    };
  },
  mapDispatchToProps
)(Component);

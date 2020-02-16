import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Chip, Button } from '@material-ui/core';
import { web3 } from 'config';
import xhr from 'utils/xhr';
import Geohash from 'latlon-geohash';
import FOAM from 'components/FOAM';
import { Link } from 'react-router-dom';
import Loader from 'components/Loader';

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
}));

const Component = ({
  match: {
    params: { url, listingHash },
  },
  showDrawer,
}) => {
  const classes = useStyles();
  const [
    {
      name,
      address,
      status,
      description,
      phone,
      web,
      geohash,
      tags = [],
      foam,
    },
    setPOI,
  ] = React.useState({});
  const [isLoaded, setIsLoaded] = React.useState(false);

  const onMount = async() => {
    setIsLoaded(false);

    const {
      data: {
        data,
        state: { deposit },
      },
    } = await xhr('get', `/poi/${listingHash}`);

    data.foam = web3.toDecimal(deposit);
    setPOI(data);
    setIsLoaded(true);
  };

  React.useEffect(
    () => {
      onMount();
      showDrawer(url);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [listingHash]
  );

  const { lon, lat } = !geohash ? {} : Geohash.decode(geohash);

  const info = [
    !name ? null : ['Name', name],
    !foam ? null : ['Foam', <FOAM amount={foam} g />],
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
      <h4 className="drawer--title">Point of Interest</h4>
      <div className="drawer--content">
        {!isLoaded ? (
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

            <Link to={`/poi/${listingHash}/challenge`}>
              <Button
                variant="outlined"
                color="secondary"
                type="submit"
                fullWidth
              >
                Challenge
              </Button>
            </Link>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default connect((state, { match: { params: { listingHash } } }) => {
  return {};
}, mapDispatchToProps)(Component);

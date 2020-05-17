import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { TextField, Chip, Button } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Geohash from 'latlon-geohash';
import uuid from 'uuid/v4';
import { IS_DEV, MINIMUM_FOAM_STAKE } from 'config';
import sl from 'utils/sl';
import xhr from 'utils/xhr';
import map from 'map';
import _ from 'lodash';

const TAGS = [
  'Art',
  'Food',
  'Retail',
  'Health',
  'Work',
  'Nightlife',
  'Blockchain',
  'Attraction',
  'Residential',
  'Education',
  'Transportation',
  'Religion',
  'Government',
];

const useStyles = makeStyles(theme => ({
  row: {
    marginBottom: 20,
  },
  chipsHeading: {
    marginBottom: 10,
    color: theme.palette.action.active,
  },
  chip: {
    marginBottom: 5,
    marginRight: 5,
  },
  button: {
    width: 100,
  },
  addButton: {
    marginRight: 5,
  },
}));

const SAMPLE_PLACE = {
  name: 'Google Inc',
  web: 'https://google.com',
  address: '10 Downing Street',
  description: 'Awesome place',
  phone: '+1 650-253-0000',
};

const Component = ({
  lat,
  lng,
  createPOI,
  approvedFOAM,
  goHome,
  showDrawer,
  match,
  loadWalletApproved,
}) => {
  const classes = useStyles();
  const [tags, setTags] = React.useState(IS_DEV ? { Food: true } : {});
  const [address, setAddress] = React.useState(
    IS_DEV ? SAMPLE_PLACE.address : ''
  );

  const hasMinimumFOAM = approvedFOAM >= MINIMUM_FOAM_STAKE;

  const onMount = async() => {
    map.showPOIBeingApplied([lng, lat]);

    console.log('looking up address %s, %s', lng, lat);
    // const {
    //   features: [feature],
    // } = await xhrMapbox(
    //   'get',
    //   `/geocoding/v5/mapbox.places/${[lng, lat].join(',')}.json`,
    //   { types: 'address,region,country' }
    // );
    //
    // if (feature) {
    //   setAddress(feature.text);
    // }
    try {
      setAddress(await xhr('get', '/poi/address', { lng, lat }));
    } catch (e) {}
  };

  React.useEffect(() => {
    onMount();
    if (_.isNil(approvedFOAM)) loadWalletApproved();
    showDrawer(match.params.url);
    return map.removePOIBeingApplied.bind(map); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lng, lat, approvedFOAM]);

  function toggleTag(tag) {
    const buff = Object.assign({}, tags);
    if (buff[tag]) {
      delete buff[tag];
    } else {
      if (Object.keys(buff).length < 3) {
        buff[tag] = true;
      }
    }
    setTags(buff);
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    const fields = {};
    ['name', 'address', 'description', 'phone', 'web', 'foam'].forEach(
      field => (fields[field] = e.target[field].value)
    );
    fields.tags = Object.keys(tags);
    fields.geohash = Geohash.encode(lat, lng);
    fields.uUID = uuid();

    const opts = {};
    opts.foam = parseFloat(fields.foam);
    delete fields.foam;

    if (opts.foam < MINIMUM_FOAM_STAKE) {
      return sl(
        'error',
        `A minimum of ${MINIMUM_FOAM_STAKE} FOAM is required.`
      );
    }
    console.log(fields, opts);

    await createPOI(fields, opts);
    sl(
      'success',
      'Transaction was created, Wait until it\'s mined ...',
      'Success'
    );
  }

  return (
    <form type="action" onSubmit={onFormSubmit}>
      <h4 className="drawer__title">Add Point of Interest</h4>
      <div className="drawer__content flex flex--column">
        <div className={classes.row}>
          <TextField
            id="name"
            label="Name"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Name of POI"
            defaultValue={IS_DEV ? SAMPLE_PLACE.name : ''}
            fullWidth
            required
          />
        </div>
        <div className={classes.row}>
          <TextField
            id="address"
            label="Address"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={'Please specify physical address of POI'}
            value={address}
            onChange={e => setAddress(e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className={classes.row}>
          <div style={{ fontSize: 10 }}>
            Longitude: {lng}
            <br />
            Latitude: {lat}
          </div>
        </div>
        <div className={classes.row}>
          <TextField
            id="description"
            label="Description"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            rows="4"
            placeholder="Write a good description of the POI here."
            defaultValue={IS_DEV ? SAMPLE_PLACE.description : ''}
            fullWidth
            required
          />
        </div>
        <div className={classes.row}>
          <div className={classes.chipsHeading}>Select up to three tags *</div>
          <div>
            {TAGS.map(tag => (
              <Chip
                key={tag}
                label={tag}
                color={tags[tag] ? 'primary' : 'default'}
                onClick={() => toggleTag(tag)}
                className={classes.chip}
              />
            ))}
          </div>
        </div>

        <div className={classes.row}>
          <TextField
            id="phone"
            label="Phone Number"
            type="tel"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Phone number associated with POI"
            defaultValue={IS_DEV ? SAMPLE_PLACE.phone : ''}
            fullWidth
            required
          />
        </div>
        <div className={classes.row}>
          <TextField
            id="web"
            label="Website"
            type="url"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={'Website associated with POI'}
            defaultValue={IS_DEV ? SAMPLE_PLACE.web : ''}
            fullWidth
          />
        </div>
        <div className={classes.row}>
          <TextField
            id="foam"
            label="FOAM stake"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={`${MINIMUM_FOAM_STAKE} FOAM minimum...`}
            defaultValue={IS_DEV ? MINIMUM_FOAM_STAKE : null}
            fullWidth
            required
          />
        </div>
        <div className={classes.row}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={clsx(classes.button, classes.addButton)}
            disabled={!hasMinimumFOAM}
          >
            Add
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => {
              goHome();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default connect(
  (
    { wallet: { approved: approvedFOAM } },
    {
      match: {
        params: { lat, lng },
      },
    }
  ) => {
    return { lat, lng, approvedFOAM };
  },
  mapDispatchToProps
)(Component);

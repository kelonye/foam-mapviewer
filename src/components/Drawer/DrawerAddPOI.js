import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { TextField, Chip, Button } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

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

const Component = ({ lat, lng }) => {
  const classes = useStyles();
  const [tags, setTags] = React.useState({});

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

  function onFormSubmit(e) {
    e.preventDefault();

    const fields = {};
    ['name', 'address', 'description', 'phoneNumber', 'website'].forEach(
      field => (fields[field] = e.target[field].value)
    );
    fields.tags = Object.keys(tags);
    console.log(fields);
  }

  return (
    <form type="action" onSubmit={onFormSubmit}>
      <h4 className="drawer--title">Add Point of Interest</h4>
      <div className="drawer--content flex flex--column">
        <div className={classes.row}>
          <TextField
            id="name"
            label="Name"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Name of POI"
            fullWidth
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
            fullWidth
          />
        </div>
        <div className={classes.row}>
          <div style={{ fontSize: 10 }}>
            Latitude: {lat}
            <br />
            Longitude: {lng}
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
            fullWidth
          />
        </div>
        <div className={classes.row}>
          <div className={classes.chipsHeading}>Select up to three tags *</div>
          <div>
            {TAGS.map(tag => (
              <Chip
                key={tag}
                label={tag}
                color={tags[tag] ? 'secondary' : 'default'}
                onClick={() => toggleTag(tag)}
                className={classes.chip}
              />
            ))}
          </div>
        </div>

        <div className={classes.row}>
          <TextField
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Phone number associated with POI"
            fullWidth
          />
        </div>
        <div className={classes.row}>
          <TextField
            id="website"
            label="Website"
            type="url"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={'Website associated with POI'}
            fullWidth
          />
        </div>
        <div className={classes.row}>
          <Button
            variant="outlined"
            color="secondary"
            type="submit"
            className={clsx(classes.button, classes.addButton)}
          >
            Add
          </Button>
          <Button variant="outlined" className={classes.button}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default connect((_, { match: { params: { lat, lng } } }) => {
  return { lat, lng };
}, mapDispatchToProps)(Component);

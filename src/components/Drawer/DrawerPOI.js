import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  container: {
    color: theme.palette.text.primary,
    padding: '5px 0',
    margin: '5px 0',
    display: 'block',
  },
  name: {},
  foam: {},
  tags: {},
}));

const Component = ({ poi }) => {
  const classes = useStyles();

  return (
    <Link
      to={`/poi/${poi.listingHash}`}
      className={clsx(classes.container, 'drawer-poi')}
    >
      <div className={classes.name}>{poi.name}</div>
      <div className={classes.foam}>{poi.foam} FOAM</div>
      <div className={classes.tags}>{poi.tags?.join(', ')}</div>
    </Link>
  );
};

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import xhr from 'utils/xhr';

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
  const [address, setAddress] = React.useState('');

  const onMount = async() => {
    try {
      const {lon: lng, lat} = poi;
      setAddress(await xhr('get', '/poi/address', { lng, lat }));
    } catch (e) {}
  };

  React.useEffect(() => {
    onMount();
  }, [poi.listingHash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link
      to={`/poi/${poi.listingHash}`}
      className={clsx(classes.container, 'drawer-poi')}
    >
      <div className={classes.name}>{poi.name}</div>
      <div className={classes.foam}>{poi.foam} FOAM</div>
      <div className={classes.tags}>{poi.tags?.join(', ')}</div>
      <div className={classes.address}>{address}</div>
    </Link>
  );
};

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

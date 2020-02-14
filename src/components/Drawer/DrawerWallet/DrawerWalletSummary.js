import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import FOAM from 'components/FOAM';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 0,
  },
  title: {
    marginBottom: 10,
  },
  listItem: {
    padding: 0,
  },
  small: { fontSize: 10 },
}));

const Component = ({ balance, approved, staked }) => {
  const classes = useStyles();
  const stats = [
    ['Balance', balance],
    ['Staked in POIs', staked],
    ['Amount of your approved tokens for each FOAM contract', approved],
  ];

  return (
    <div>
      <Typography variant="h6" className={classes.title}>
        FOAM
      </Typography>

      <List className={classes.root}>
        {stats.map(([k, v]) => (
          <ListItem key={k} className={classes.listItem}>
            <ListItemText
              primary={<FOAM amount={v} />}
              secondary={<span className={classes.small}>{k}</span>}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default connect(({ wallet }) => {
  return {
    ...wallet,
  };
}, mapDispatchToProps)(Component);

import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import FOAM from 'components/FOAM';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { SECONDARY_COLOR } from 'config';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 0,
  },
  title: {
    marginBottom: 10,
    fontSize: 13,
    fontWeight: 'bolder',
    textTransform: 'uppercase',
    textDecoration: 'underline',
  },
  listItem: {
    padding: 0,
  },
  small: { fontSize: 10 },
  link: {
    color: SECONDARY_COLOR,
    textTransform: 'uppercase',
    fontSize: 10,
    marginLeft: 10,
  },
  paper: {
    marginBottom: 10,
    padding: '10px 10px 0',
  },
}));

const Component = ({
  balance,
  approved,
  staked,
  poisListed,
  poisChallenged,
  poisPending,
}) => {
  const classes = useStyles();
  const stats = [
    {
      heading: 'FOAM',
      stats: [
        [
          'Balance',
          <FOAM amount={balance} />,
          { url: '/wallet/registry', name: 'top up' },
        ],
        ['Staked in POIs', <FOAM amount={staked} />],
        [
          'Amount of your approved tokens for each FOAM contract',
          <FOAM amount={approved} />,
          { url: '/wallet/registry', name: 'update' },
        ],
      ],
    },
    {
      heading: 'Points of Interest',
      stats: [
        ['Verified', poisListed],
        ['Challenged', poisChallenged],
        ['Pending', poisPending],
      ],
    },
  ];

  return (
    <div>
      {stats.map(stat => (
        <Card key={stat.heading} className={classes.paper} variant="outlined">
          <CardContent>
            <Typography variant="h6" className={classes.title}>
              {stat.heading}
            </Typography>

            <List className={classes.root}>
              {stat.stats.map(([k, v, link]) => (
                <ListItem key={k} className={classes.listItem}>
                  <ListItemText
                    primary={
                      <div className={'flex flex--align-center'}>
                        {v}
                        {!link ? null : (
                          <Link
                            to={link.url}
                            className="flex flex--align-center"
                          >
                            <small className={classes.link}>{link.name}</small>
                          </Link>
                        )}
                      </div>
                    }
                    secondary={<span className={classes.small}>{k}</span>}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default connect(({ wallet }) => {
  return {
    ...wallet,
  };
}, mapDispatchToProps)(Component);

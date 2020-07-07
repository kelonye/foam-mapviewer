import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import FOAM from 'components/FOAM';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { PRIMARY_COLOR } from 'config';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  list: {
    flexGrow: 1,
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
  },
  listItem: {
    padding: 0,
  },
  title: {
    marginBottom: 10,
    fontSize: 13,
    fontWeight: 'bolder',
  },
  small: { fontSize: 10 },
  link: {
    color: PRIMARY_COLOR,
    textTransform: 'uppercase',
    fontSize: 10,
    marginLeft: 5,
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
          { url: '/top-up', name: 'top up' },
        ],
        ['Staked', <FOAM amount={staked} />],
        [
          'Approved',
          <FOAM amount={approved} />,
          { url: '/wallet/registry', name: 'update' },
        ],
      ],
    },
    {
      heading: 'Places',
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
        <div key={stat.heading} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            {stat.heading}
          </Typography>

          <div
            className={clsx(
              classes.root,
              'flex',
              'flex--justify-space',
              'flex--grow'
            )}
          >
            {stat.stats.map(([k, v, link]) => (
              <div
                key={k}
                className={clsx('flex', 'flex--column', 'flex--align-center')}
              >
                <div>{v}</div>
                <span className={classes.small}>{k}</span>{' '}
                {!link ? null : (
                  <Link to={link.url}>
                    <small className={classes.link}>{link.name}</small>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default connect(({ wallet }) => {
  return {
    ...wallet,
  };
}, mapDispatchToProps)(Component);

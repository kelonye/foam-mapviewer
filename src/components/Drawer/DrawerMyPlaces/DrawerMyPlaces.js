import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  subCategorySwitchLabel: {
    fontSize: 12,
  },
}));

const Component = ({ showDrawer, match }) => {
  const classes = useStyles();

  React.useEffect(
    () => {
      showDrawer(match.params.url);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div>
      <h4 className="drawer__title">My Places</h4>
      <div className="drawer__content">WORK IN PROGRESS...</div>
    </div>
  );
};

export default connect(state => {
  return {};
}, mapDispatchToProps)(Component);

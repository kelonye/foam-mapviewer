import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
} from '@material-ui/core';
import { tagsInViewSelector } from 'selectors/map';
import Close from 'components/Drawer/DrawerClose';

const useStyles = makeStyles(theme => ({
  subCategorySwitchLabel: {
    fontSize: 12,
  },
}));

const Component = ({ tags, togglePOITagVisibility, showDrawer, match }) => {
  const classes = useStyles();

  React.useEffect(
    () => {
      showDrawer(match.params.url);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div>
      <Close goBack />
      <h4 className="drawer__title drawer__title--padded">Filter / Sort</h4>
      <div className="drawer__content">
        <FormGroup>
          <div style={{ marginLeft: 30 }} className="flex flex--column">
            {tags.map(tag => (
              <FormControlLabel
                key={tag.name}
                control={
                  <Switch
                    checked={tag.visible}
                    onChange={e => togglePOITagVisibility(tag.name)}
                    value={tag.name}
                    size={'small'}
                    color={'primary'}
                  />
                }
                label={
                  <Typography className={classes.subCategorySwitchLabel}>
                    {tag.name}
                  </Typography>
                }
              />
            ))}
          </div>
        </FormGroup>
      </div>
    </div>
  );
};

export default connect(state => {
  return {
    tags: tagsInViewSelector(state),
  };
}, mapDispatchToProps)(Component);

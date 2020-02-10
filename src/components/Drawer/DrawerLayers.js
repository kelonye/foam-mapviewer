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
import { layersSelector } from 'selectors/drawer';
import { LAYER_TYPE_POI } from 'config';

const useStyles = makeStyles(theme => ({
  subCategorySwitchLabel: {
    fontSize: 12,
  },
}));

const Component = ({
  layers,
  toggleLayerVisibility,
  togglePOITagVisibility,
}) => {
  const classes = useStyles();
  return (
    <div>
      <h4 className="drawer--title">Layers</h4>
      <div className="drawer--content">
        <FormGroup>
          {layers.map(layer => (
            <div key={layer.id}>
              <FormControlLabel
                control={
                  <Switch
                    checked={layer.visible}
                    onChange={e => toggleLayerVisibility(layer.id)}
                    value={layer.id}
                  />
                }
                className={classes.subCategorySwitchLabel}
                label={layer.name}
              />
              {layer.id !== LAYER_TYPE_POI ? null : (
                <div style={{ marginLeft: 30 }} className="flex flex--column">
                  {layer.tags.map(tag => (
                    <FormControlLabel
                      key={tag.name}
                      control={
                        <Switch
                          checked={tag.visible}
                          onChange={e => togglePOITagVisibility(tag.name)}
                          value={tag.name}
                          disabled={!layer.visible}
                          size={'small'}
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
              )}
            </div>
          ))}
        </FormGroup>
      </div>
    </div>
  );
};

export default connect(state => {
  return {
    layers: layersSelector(state),
  };
}, mapDispatchToProps)(Component);

import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { layersSelector } from 'selectors/drawer';

const Component = ({ layers, toggleLayerVisibility }) => {
  return (
    <div>
      <h4 className="drawer--title">Layers</h4>
      <div className="drawer--content">
        <FormGroup>
          {layers.map(layer => (
            <FormControlLabel
              key={layer.id}
              control={
                <Switch
                  checked={layer.visible}
                  onChange={e => toggleLayerVisibility(layer.id)}
                  value={layer.id}
                />
              }
              label={layer.name}
            />
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

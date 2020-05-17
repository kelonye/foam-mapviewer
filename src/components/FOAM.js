import React from 'react';
import _ from 'lodash';
import { deserializeFoam } from 'utils/foam';

export default function({ amount }) {
  return _.isNil(amount) ? null : (
    <span>{deserializeFoam(amount).toFixed(2)}</span>
  );
}

import React from 'react';
import _ from 'lodash';
import { WEB3, FOAM_TOKEN_DECIMALS } from 'utils/wallet';

export default function({ amount }) {
  return _.isNil(amount) ? null : (
    <span>
      {new WEB3.utils.toBN(amount.toString())
        .div(FOAM_TOKEN_DECIMALS)
        .toNumber()
        .toFixed(2)}
    </span>
  );
}

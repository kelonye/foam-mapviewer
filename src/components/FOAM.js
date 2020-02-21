import React from 'react';
import { WEB3, FOAM_TOKEN_DECIMALS } from 'utils/wallet';

export default function({ amount }) {
  return (
    <span>
      {new WEB3.utils.toBN(amount.toString())
        .div(FOAM_TOKEN_DECIMALS)
        .toNumber()
        .toFixed(2)}
    </span>
  );
}

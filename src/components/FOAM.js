import React from 'react';

export default ({ amount }) => (
  <span>{((amount || 0) / 10000).toFixed(2)}</span>
);

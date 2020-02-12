import React from 'react';

export default ({ amount }) => <span>{(amount / 10000).toFixed(2)}</span>;

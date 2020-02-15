import React from 'react';
import { FOAM_G, FOAM_K } from 'config';

export default ({ amount, g, k }) => (
  <span>{((amount || 0) / (g ? FOAM_G : FOAM_K)).toFixed(2)}</span>
);

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default ({ opacity = 1, fullscreen = true }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      ...(fullscreen
        ? {
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }
        : {}),
      zIndex: 1000,
      opacity,
    }}
  >
    <div style={{ position: 'relative' }}>
      <Loader />
    </div>
  </div>
);

export function Loader() {
  return (
    <CircularProgress
      style={{ position: 'relative' }}
      left={0}
      top={0}
      status="loading"
    />
  );
}

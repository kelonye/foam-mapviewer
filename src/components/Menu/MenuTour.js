import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import Button from './MenuButton';
import Joyride, { STATUS } from 'react-joyride';

const STEPS = [
  {
    target: '[data-tour=places]',
    content: 'Filter Points of Interests, Signals etc on map.',
  },
  {
    target: '[data-tour=wallet]',
    content: 'Manage your FOAM assets.',
  },
  {
    target: '[data-tour=add]',
    content: 'Add Points of Interest, Signals ... etc',
  },
  {
    target: '[data-tour=theme]',
    content: 'Toggle light/dark theme.',
  },
].map(t => ({ ...t, disableBeacon: true }));

const Tour = ({ isRunningTour, setIsRunningTour }) => {
  const handleJoyrideCallback = data => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setIsRunningTour(false);
    }
  };

  return (
    <div className="app">
      <Joyride
        run={isRunningTour}
        callback={handleJoyrideCallback}
        steps={STEPS}
        showSkipButton={true}
        showProgress={true}
        continuous={true}
      />
    </div>
  );
};

const Component = props => {
  const [isRunningTour, setIsRunningTour] = React.useState(false);

  const onClick = event => {
    setIsRunningTour(true);
  };

  return (
    <React.Fragment>
      <Button {...props} {...{ onClick }} />
      <Tour {...{ isRunningTour, setIsRunningTour }} />
    </React.Fragment>
  );
};

export default connect(state => {
  const { drawer } = state;
  return {
    drawerType: drawer.type,
  };
}, mapDispatchToProps)(Component);

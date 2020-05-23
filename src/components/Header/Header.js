import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import {
  HEADER_HEIGHT,
  // MENU_WIDTH
} from 'config';
// import { IconButton, Tooltip } from '@material-ui/core';
// import MenuIcon from '@material-ui/icons/Menu';
// import LightIcon from '@material-ui/icons/Brightness7';
// import DarkIcon from '@material-ui/icons/Brightness2';
import { isDarkSelector } from 'selectors/theme';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles(theme => ({
//   container: props => ({
//     backgroundColor: theme.backgroundColor,
//   }),
//   icon: {
//     height: 28,
//     width: 28,
//   },
// }));

function Component({ toggleMenu, toggleTheme, isDark, isMobile }) {
  // const classes = useStyles();

  // const left = isMobile ? (
  //   <div style={{ marginLeft: 15 }}></div>
  // ) : (
  //   <div className="flex flex--align-center flex--grow">
  //     <span className="menu-button-container" style={{ width: MENU_WIDTH }}>
  //       <IconButton
  //         data-tip
  //         data-for="menuButton"
  //         className="header__menu"
  //         onClick={toggleMenu}
  //       >
  //         <MenuIcon className={classes.icon} />
  //       </IconButton>
  //     </span>
  //   </div>
  // );

  // const right = (
  //   <Tooltip title="Toggle light/dark theme">
  //     <IconButton onClick={toggleTheme} data-tour="theme">
  //       {isDark ? (
  //         <LightIcon className={classes.icon} />
  //       ) : (
  //         <DarkIcon className={classes.icon} />
  //       )}
  //     </IconButton>
  //   </Tooltip>
  // );

  return (
    <div
      className={'header flex flex--align-center'}
      style={{ height: HEADER_HEIGHT }}
    >
      {/*{left}*/}

      <div className="header__sep flex flex--justify-center">
        <img src="/logo.png" alt="FOAM logo" height="30px" />
      </div>

      {/*{right}*/}
    </div>
  );
}

const mapStateToProps = state => {
  const { isMobile } = state.app;
  return {
    isDark: isDarkSelector(state),
    isMobile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);

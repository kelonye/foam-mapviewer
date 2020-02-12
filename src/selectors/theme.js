import { createMuiTheme } from '@material-ui/core/styles';
import { PRIMARY_COLOR, SECONDARY_COLOR } from 'config';
import { createSelector } from 'reselect';

export const isDarkSelector = createSelector(
  state => state.app.theme,
  theme => theme === 'dark'
);

export default createSelector(isDarkSelector, isDark =>
  createMuiTheme({
    typography: {
      fontFamily: [
        'Roboto',
        'Avenir',
        'proxima-nova',
        'Source Sans Pro',
        'Avenir',
        'sans-serif',
      ].join(','),
    },
    palette: {
      type: isDark ? 'dark' : 'light',
      primary: {
        main: PRIMARY_COLOR,
      },
      secondary: {
        main: SECONDARY_COLOR,
      },
      // error: {
      //   main: red.A400,
      // },
      background: {
        default: isDark ? '#212121' : '#fff',
      },
    },
    overrides: {
      MuiButton: {
        root: {
          borderRadius: 2,
        },
      },
    },
  })
);

import { createMuiTheme } from '@material-ui/core/styles';
import { PRIMARY_COLOR, SECONDARY_COLOR } from 'config';

const theme = createMuiTheme({
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
      default: '#fff',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 2,
      },
    },
  },
});

export default theme;

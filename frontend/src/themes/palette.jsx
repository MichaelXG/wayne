// material-ui
import { createTheme } from '@mui/material/styles';

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

/**
 * Cria o tema com paleta baseada no modo e preset de cor.
 * @param {'light' | 'dark'} mode - modo do tema
 * @param {string} presetColor - nome do preset (ex: 'default')
 * @returns {object} tema MUI
 */
export default function Palette(mode, presetColor = 'default') {
  // Aqui você pode expandir futuramente para múltiplos presets
  let colors;
  switch (presetColor) {
    case 'default':
    default:
      colors = defaultColor;
  }

  return createTheme({
    palette: {
      mode,
      common: {
        black: colors.darkPaper ?? '#000000'
      },
      primary: {
        light: colors.primaryLight ?? '#7986cb',
        main: colors.primaryMain ?? '#3f51b5',
        dark: colors.primaryDark ?? '#303f9f',
        200: colors.primary200 ?? '#9fa8da',
        800: colors.primary800 ?? '#283593'
      },
      secondary: {
        light: colors.secondaryLight ?? '#ff4081',
        main: colors.secondaryMain ?? '#f50057',
        dark: colors.secondaryDark ?? '#c51162',
        200: colors.secondary200 ?? '#ff80ab',
        800: colors.secondary800 ?? '#ad1457'
      },
      error: {
        light: colors.errorLight ?? '#e57373',
        main: colors.errorMain ?? '#f44336',
        dark: colors.errorDark ?? '#d32f2f'
      },
      orange: {
        light: colors.orangeLight ?? '#ffb74d',
        main: colors.orangeMain ?? '#ff9800',
        dark: colors.orangeDark ?? '#f57c00'
      },
      warning: {
        light: colors.warningLight ?? '#ffb74d',
        main: colors.warningMain ?? '#ff9800',
        dark: colors.warningDark ?? '#f57c00',
        contrastText: colors.grey700 ?? '#616161'
      },
      success: {
        light: colors.successLight ?? '#81c784',
        200: colors.success200 ?? '#a5d6a7',
        main: colors.successMain ?? '#4caf50',
        dark: colors.successDark ?? '#388e3c'
      },
      grey: {
        50: colors.grey50 ?? '#fafafa',
        100: colors.grey100 ?? '#f5f5f5',
        200: colors.grey200 ?? '#eeeeee',
        500: colors.grey500 ?? '#9e9e9e',
        600: colors.grey600 ?? '#757575',
        700: colors.grey700 ?? '#616161',
        900: colors.grey900 ?? '#212121'
      },
      dark: {
        light: colors.darkTextPrimary ?? '#ffffffde',
        main: colors.darkLevel1 ?? '#121212',
        dark: colors.darkLevel2 ?? '#000000de',
        800: colors.darkBackground ?? '#121212',
        900: colors.darkPaper ?? '#1d1d1d'
      },
      text: {
        primary: colors.grey700 ?? '#616161',
        secondary: colors.grey500 ?? '#9e9e9e',
        dark: colors.grey900 ?? '#212121',
        hint: colors.grey100 ?? '#f5f5f5'
      },
      divider: colors.grey200 ?? '#eeeeee',
      background: {
        paper: colors.paper ?? '#fff',
        default: colors.paper ?? '#fff'
      }
    }
  });
}

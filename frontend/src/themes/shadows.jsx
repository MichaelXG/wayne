// material-ui
import { alpha } from '@mui/material/styles';

/**
 * Gera um objeto com sombras customizadas baseadas na cor e no tema
 * @param {object} theme - tema Material-UI
 * @param {string} baseColor - cor base para sombras cinza (ex: theme.palette.grey[900])
 * @returns {object} objeto com níveis de sombra e cores específicas
 */
function createCustomShadow(theme, baseColor) {
  const transparent = alpha(baseColor, 0.24);

  // Sombras neutras (cinza) com opacidade fixa
  const neutralShadows = {
    z1: `0 1px 2px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px 0 ${transparent}, 0 10px 20px 0 ${transparent}`,
    z16: `0 0 3px 0 ${transparent}, 0 14px 28px -5px ${transparent}`,
    z20: `0 0 3px 0 ${transparent}, 0 18px 36px -5px ${transparent}`,
    z24: `0 0 6px 0 ${transparent}, 0 21px 44px 0 ${transparent}`
  };

  // Sombras coloridas baseadas nas cores do tema, com opacidade 0.3
  const coloredShadows = {
    primary: `0px 12px 14px 0px ${alpha(theme.palette.primary.main, 0.3)}`,
    secondary: `0px 12px 14px 0px ${alpha(theme.palette.grey[600], 0.3)}`,
    orange: `0px 12px 14px 0px ${alpha(theme.palette.orange.main, 0.3)}`,
    success: `0px 12px 14px 0px ${alpha(theme.palette.success.main, 0.3)}`,
    warning: `0px 12px 14px 0px ${alpha(theme.palette.warning.main, 0.3)}`,
    error: `0px 12px 14px 0px ${alpha(theme.palette.error.main, 0.3)}`
  };

  return { ...neutralShadows, ...coloredShadows };
}

/**
 * Exporta as sombras customizadas para o tema
 * Pode usar o mode para ajustes futuros (ex: sombra mais clara no modo dark)
 * @param {string} mode - modo do tema ('light' | 'dark')
 * @param {object} theme - tema Material-UI
 * @returns {object} sombras customizadas
 */
export default function customShadows(mode, theme) {
  // Exemplo: pode variar sombra base no dark mode
  const baseColor = mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900];
  return createCustomShadow(theme, baseColor);
}

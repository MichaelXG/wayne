import DefaultToolbar from './DefaultToolbar';
import DefaultNoRowsOverlay from './DefaultNoRowsOverlay';

/**
 * Cria os slots para o DataGrid com opções customizáveis.
 *
 * @param {Object} config - Configuração de slots.
 * @param {React.Component} config.toolbar - Componente customizado para toolbar.
 * @param {React.Component} config.noRowsOverlay - Componente customizado para noRowsOverlay.
 * @returns {Object} slots para DataGrid
 */
const createDataGridSlots = ({ toolbar = DefaultToolbar, noRowsOverlay = DefaultNoRowsOverlay } = {}) => {
  return {
    toolbar,
    noRowsOverlay
  };
};

export default createDataGridSlots;

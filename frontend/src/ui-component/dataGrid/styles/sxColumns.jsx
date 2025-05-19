const sxColumns = (theme) => ({
  borderRadius: 2,

  // Cabeçalho com cor de fundo e texto do tema
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.secondary,
    fontWeight: 'bold'
  },

  // Texto do cabeçalho alinhado à esquerda
  '& .MuiDataGrid-columnHeaderTitle': {
    display: 'flex',
    justifyContent: 'flex-start',
    fontWeight: 'bold'
  },

  // Linhas zebrada com cores do tema
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.default
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: theme.palette.background.paper
  },

  // Hover em qualquer linha
  '& .MuiDataGrid-row:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.3s ease'
  },

  // Linha com checkbox marcado
  '& .MuiDataGrid-row.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.selected
    }
  },

  // Hover nos botões ou checkbox dentro da célula
  '& .MuiDataGrid-cell:has(button:hover), & .MuiDataGrid-cellCheckbox:hover': {
    backgroundColor: theme.palette.action.focus,
    transition: 'background-color 0.3s ease'
  },

  // Células em geral
  '& .MuiDataGrid-cell': {
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    whiteSpace: 'normal !important',
    wordBreak: 'break-word',
    lineHeight: 1.5,
    paddingTop: theme.spacing(0.2),
    paddingBottom: theme.spacing(0.2)
  },

  // Checkbox centralizado
  '& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Estilo do checkbox com cor secundária do tema
  '& .MuiCheckbox-root': {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    '&.Mui-checked': {
      color: theme.palette.grey[600]
    },
    '&:hover': {
      backgroundColor: theme.palette.action.focus
    }
  },

  // Overlay (quando vazio/carregando)
  '& .MuiDataGrid-overlay': {
    display: 'flex'
  }
});

export default sxColumns;

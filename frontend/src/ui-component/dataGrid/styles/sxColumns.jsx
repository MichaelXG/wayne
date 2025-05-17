const sxColumns = {
  borderRadius: 2,

  // Cabeçalho com cor de fundo
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#eeeeee !important', // força a cor de fundo
    color: '#637381 !important', // força a cor do texto
    fontWeight: 'bold'
  },

  // Texto do cabeçalho alinhado à esquerda
  '& .MuiDataGrid-columnHeaderTitle': {
    display: 'flex',
    justifyContent: 'flex-start',
    fontWeight: 'bold !important'
  },

  // Linhas zebrada
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9'
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: '#fff'
  },

  // Hover em qualquer linha
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#f0f4ff',
    transition: 'background-color 0.3s ease'
  },

  // ✅ Linha com checkbox marcado
  '& .MuiDataGrid-row.Mui-selected': {
    backgroundColor: '#e8dcff',
    '&:hover': {
      backgroundColor: '#dac8ff'
    }
  },

  // Hover nos botões ou checkbox dentro da célula
  '& .MuiDataGrid-cell:has(button:hover), & .MuiDataGrid-cellCheckbox:hover': {
    backgroundColor: 'rgba(142, 51, 255, 0.08)',
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
    paddingTop: 1.5,
    paddingBottom: 1.5
  },

  // Checkbox centralizado
  '& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Estilo do checkbox
  '& .MuiCheckbox-root': {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    '&.Mui-checked': {
      color: 'secondary.main'
    },
    '&:hover': {
      backgroundColor: 'rgba(142, 51, 255, 0.08)'
    }
  },

  // Overlay (quando vazio/carregando)
  '& .MuiDataGrid-overlay': {
    display: 'flex'
  }
};

export default sxColumns;

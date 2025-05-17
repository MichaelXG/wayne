// project imports
import componentsOverrides from './overrides';

export default function componentStyleOverrides(theme, borderRadius, outlinedFilled) {
  const bgColor = theme.palette.grey[50];
  const menuSelectedBack = theme.palette.secondary.light;
  const menuSelected = theme.palette.secondary.dark;

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: `${borderRadius}px`,
          textTransform: 'none',
          transition: 'all 0.2s ease',
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.common.white,
          '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary.dark
          },
          '&:focus': {
            outline: `2px solid ${theme.palette.secondary.main}`
          }
        },
        textSecondary: {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.common.white,
          '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary.dark
          }
        },
        sizeSmall: {
          padding: '4px 10px',
          fontSize: '0.75rem'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        '.swiper-button-next::after, .swiper-button-prev::after': {
          color: theme.palette.secondary.main
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: theme.palette.secondary.main,
          '&.Mui-checked': {
            color: theme.palette.secondary.main
          },
          '&:hover': {
            backgroundColor: `${theme.palette.secondary.light}`
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.main}`
          },
          '& + .MuiFormControlLabel-label': {
            marginTop: 2
          }
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.common.white,
          transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.secondary[800], // um tom mais escuro porém ainda elegante
            boxShadow: theme.shadows[4],
            color: theme.palette.common.white
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.main}`,

            outlineOffset: 2
          },
          '&:disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled
          }
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        rounded: {
          borderRadius: `${borderRadius}px`
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.palette.text.dark,
          padding: '24px'
        },
        title: {
          fontSize: '1.125rem'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px'
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '24px'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: 'center'
        },
        outlined: {
          border: '1px dashed'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          paddingTop: '10px',
          paddingBottom: '10px',
          '&.Mui-selected': {
            color: menuSelected,
            backgroundColor: menuSelectedBack,
            '&:hover': {
              backgroundColor: menuSelectedBack
            },
            '& .MuiListItemIcon-root': {
              color: menuSelected
            }
          },
          '&:hover': {
            backgroundColor: menuSelectedBack,
            color: menuSelected,
            '& .MuiListItemIcon-root': {
              color: menuSelected
            }
          }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          minWidth: '36px'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        secondary: {
          color: theme.palette.text.dark
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '&.MuiDataGrid-toolbarQuickFilter': {
            borderRadius: `${borderRadius}px`,
            backgroundColor: theme.palette.background.paper,
            paddingLeft: 8,
            paddingRight: 8,
            height: 40,
            '& .MuiInputBase-root': {
              color: theme.palette.text.primary,
              '& input': {
                padding: '8px 0',
                fontSize: '0.875rem'
              },
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: `2px solid ${theme.palette.secondary.light}`
              },
              '&:after': {
                borderBottomColor: theme.palette.secondary.main
              }
            },
            '& .MuiSvgIcon-root': {
              color: theme.palette.secondary.main,
              fontSize: '1.1rem'
            },
            '& .MuiIconButton-root': {
              color: theme.palette.secondary.dark,
              '&:hover': {
                backgroundColor: theme.palette.secondary.light
              }
            }
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&.MuiDataGrid-toolbarQuickFilter': {
            backgroundColor: theme.palette.background.paper,
            borderRadius: `${borderRadius}px`,
            padding: '0 8px',
            transition: 'all 0.2s ease',
            border: `1px solid ${theme.palette.grey[300]}`,

            '&:hover': {
              borderColor: theme.palette.secondary.light
            },
            '&.Mui-focused': {
              borderColor: theme.palette.secondary.main,
              boxShadow: `0 0 0 2px ${theme.palette.secondary.main}33`
            },
            '& input::placeholder': {
              color: theme.palette.grey[500],
              opacity: 1
            }
          }
        },
        underline: {
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `2px solid ${theme.palette.secondary.light}`
          },
          '&:after': {
            borderBottom: `2px solid ${theme.palette.secondary.main}`
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: theme.palette.text.dark,
          '&::placeholder': {
            color: theme.palette.text.secondary,
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: outlinedFilled ? bgColor : 'transparent',
          borderRadius: `${borderRadius}px`,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[400]
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.secondary.light
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.secondary.main
          },
          '&.MuiInputBase-multiline': {
            padding: 1
          }
        },
        input: {
          fontWeight: 500,
          background: outlinedFilled ? bgColor : 'transparent',
          padding: '15.5px 14px',
          borderRadius: `${borderRadius}px`,
          '&::placeholder': {
            color: theme.palette.text.secondary,
            fontSize: '0.875rem'
          },
          '&.MuiInputBase-inputSizeSmall': {
            padding: '10px 14px',
            '&.MuiInputBase-inputAdornedStart': {
              paddingLeft: 0
            }
          }
        },
        inputAdornedStart: {
          paddingLeft: 4
        },
        notchedOutline: {
          borderRadius: `${borderRadius}px`
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.palette.secondary.main
          },
          '&.Mui-error': {
            color: theme.palette.error.main
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: theme.palette.secondary.main,
          transition: 'color 0.3s ease, background-color 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.common.white
          },
          '&:focus': {
            outline: `2px solid ${theme.palette.secondary.main}`
          }
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: theme.palette.grey[300]
          }
        },
        mark: {
          backgroundColor: theme.palette.background.paper,
          width: '4px'
        },
        valueLabel: {
          color: theme.palette.secondary.light
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiAutocomplete-tag': {
            background: theme.palette.secondary.light,
            borderRadius: `${borderRadius}px`,
            color: theme.palette.text.dark,
            '.MuiChip-deleteIcon': {
              color: theme.palette.secondary[200]
            }
          }
        },
        popper: {
          borderRadius: `${borderRadius}px`,
          boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.divider
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          '&:focus': {
            backgroundColor: 'transparent'
          }
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: theme.palette.secondary.dark,
          background: theme.palette.secondary[200]
        }
      }
    },
    MuiTimelineContent: {
      styleOverrides: {
        root: {
          color: theme.palette.text.dark,
          fontSize: '16px'
        }
      }
    },
    MuiTreeItem: {
      styleOverrides: {
        label: {
          marginTop: 14,
          marginBottom: 14
        }
      }
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        }
      }
    },
    MuiInternalDateTimePickerTabs: {
      styleOverrides: {
        tabs: {
          backgroundColor: theme.palette.secondary.light,
          '& .MuiTabs-flexContainer': {
            borderColor: theme.palette.secondary[200]
          },
          '& .MuiTab-root': {
            color: theme.palette.text.dark
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.secondary.dark
          },
          '& .Mui-selected': {
            color: theme.palette.secondary.dark
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        flexContainer: {
          borderBottom: '1px solid',
          borderColor: theme.palette.grey[200]
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: '12px 0 12px 0'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.grey[200],
          '&.MuiTableCell-head': {
            fontSize: '0.875rem',
            color: theme.palette.grey[900],
            fontWeight: 500
          }
        }
      }
    },
    MuiDateTimePickerToolbar: {
      styleOverrides: {
        timeDigitsContainer: {
          alignItems: 'center'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          margin: 0,
          lineHeight: 1.4,
          color: theme.palette.background.paper,
          background: theme.palette.text.secondary
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem'
        }
      }
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          margin: '3px'
        }
      }
    },
    MuiDataGrid: {
      defaultProps: {
        rowHeight: 54
      },
      styleOverrides: {
        root: {
          borderWidth: 0,
          '& .MuiDataGrid-columnHeader--filledGroup': {
            borderBottomWidth: 0
          },
          '& .MuiDataGrid-columnHeader--emptyGroup': {
            borderBottomWidth: 0
          },
          '& .MuiFormControl-root>.MuiInputBase-root': {
            backgroundColor: `${theme.palette.background.default} !important`,
            borderColor: `${theme.palette.divider} !important`
          }
        },
        withBorderColor: {
          borderColor: theme.palette.divider
        },
        toolbarContainer: {
          '& .MuiButton-root': {
            paddingLeft: '16px !important',
            paddingRight: '16px !important'
          }
        },
        columnHeader: {
          color: theme.palette.grey[600],
          // backgroundColor: theme.palette.grey[200],
          paddingLeft: 24,
          paddingRight: 24
        },
        footerContainer: {
          '&.MuiDataGrid-withBorderColor': {
            borderBottom: 'none'
          }
        },
        columnHeaderCheckbox: {
          paddingLeft: 0,
          paddingRight: 0
        },
        cellCheckbox: {
          paddingLeft: 0,
          paddingRight: 0
        },
        cell: {
          borderWidth: 1,
          paddingLeft: 24,
          paddingRight: 24,
          borderColor: theme.palette.divider,
          '&.MuiDataGrid-cell--withRenderer > div ': {
            ' > .high': {
              background: theme.palette.success.light
            },
            '& > .medium': {
              background: theme.palette.warning.light
            },
            '& > .low': {
              background: theme.palette.error.light
            }
          }
        }
      }
    },
    ...componentsOverrides(theme)
  };
}

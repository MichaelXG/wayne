import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import useConfig from 'hooks/useConfig';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function NavItem({ item, level, isParents = false, setSelectedID, openMenuId, parentId }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);

  const { pathname } = useLocation();
  const { borderRadius } = useConfig();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const isSelected = !!matchPath({ path: item?.link ? item.link : item.url, end: false }, pathname);
  const isParentSelected = parentId && openMenuId === parentId;

  const [hoverStatus, setHover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (openMenuId && !isSelected) {
      setSelectedID && setSelectedID('');
      setIsHovered(false);
    }
  }, [openMenuId, isSelected, setSelectedID]);

  const handleMouseEnter = () => {
    if (!drawerOpen) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!drawerOpen) {
      setIsHovered(false);
    }
  };

  const compareSize = () => {
    const compare = ref.current && ref.current.scrollWidth > ref.current.clientWidth;
    setHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
    return () => window.removeEventListener('resize', compareSize);
  }, []);

  const Icon = item?.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size={drawerOpen ? '20px' : '24px'} style={{ ...(isParents && { fontSize: 20, stroke: '1.5' }) }} />
  ) : (
    <FiberManualRecordIcon sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }} fontSize={level > 0 ? 'inherit' : 'medium'} />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const itemHandler = () => {
    if (downMD) handlerDrawerOpen(false);

    if (isParents && setSelectedID) {
      setSelectedID(isSelected ? '' : item.id);
    }
    
    if (!drawerOpen) {
      setIsHovered(false);
    }
  };

  const iconSelectedColor = theme.palette.grey[600];

  return (
    <ListItemButton
      disableRipple
      component={Link}
      to={item.url}
      target={itemTarget}
      disabled={item.disabled}
      selected={isSelected}
      onClick={itemHandler}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={level > 1 ? 'submenu-items' : ''}
      sx={(theme) => ({
        zIndex: 1201,
        borderRadius: `${borderRadius}px`,
        mb: 0.5,
        alignItems: (!drawerOpen && level === 1) ? 'center' : 'flex-start',
        flexDirection: (!drawerOpen && level === 1) ? 'column' : 'row',
        padding: (!drawerOpen && level === 1) ? '8px 12px' : undefined,
        minHeight: (!drawerOpen && level === 1) ? '64px' : '38px',

        ...(drawerOpen &&
          level !== 1 && {
            ml: `${level * 16}px`,
            pl: 2
          }),

        ...(!drawerOpen && {
          pl: level === 1 ? 0 : 1.25
        }),

        ...(drawerOpen && {
          '&:hover': {
            bgcolor: theme.palette.grey[300],
            color: theme.palette.grey[900],
            fontWeight: 700,
            fontStyle: 'italic',
            '& .MuiListItemIcon-root': {
              color: theme.palette.grey[500]
            },
            '& .MuiTypography-root': {
              color: theme.palette.grey[900],
              fontWeight: 700,
              fontStyle: 'italic'
            },
            '& .MuiTypography-caption': {
              color: theme.palette.grey[900],
              fontWeight: 600,
              fontStyle: 'italic'
            }
          },
          '&.Mui-selected': {
            bgcolor: theme.palette.grey[300],
            color: theme.palette.grey[900],
            fontWeight: 700,
            fontStyle: 'italic',
            '& .MuiListItemIcon-root': {
              color: theme.palette.grey[500]
            }
          }
        }),

        ...((!drawerOpen || level !== 1) && {
          py: level === 1 ? 0 : 1,
          '&:hover': {
            bgcolor: theme.palette.grey[300],
            color: theme.palette.grey[900],
            fontWeight: 700,
            fontStyle: 'italic',
            '& .MuiListItemIcon-root': {
              color: theme.palette.grey[500]
            },
            '& .MuiTypography-root': {
              color: theme.palette.grey[900],
              fontWeight: 700,
              fontStyle: 'italic'
            },
            '& .MuiTypography-caption': {
              color: theme.palette.grey[900],
              fontWeight: 600,
              fontStyle: 'italic'
            }
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: theme.palette.grey[300],
              color: theme.palette.grey[900],
              fontWeight: 700,
              fontStyle: 'italic',
              '& .MuiListItemIcon-root': {
                color: theme.palette.grey[500]
              },
              '& .MuiTypography-root': {
                color: theme.palette.grey[900],
                fontWeight: 700,
                fontStyle: 'italic'
              },
              '& .MuiTypography-caption': {
                color: theme.palette.grey[900],
                fontWeight: 600,
                fontStyle: 'italic'
              }
            },
            bgcolor: theme.palette.grey[300],
            color: theme.palette.grey[900],
            fontWeight: 700,
            fontStyle: 'italic',
            '& .MuiListItemIcon-root': {
              color: theme.palette.grey[500]
            }
          }
        }),

        ...(level > 1 && {
          '&:before': drawerOpen && {
            content: '""',
            position: 'absolute',
            left: `${(level - 1) * 16}px`,
            top: '50%',
            width: '16px',
            height: '1px',
            backgroundColor: theme.palette.grey[300],
            transform: 'translateY(-50%)'
          },
          '&:after': drawerOpen && {
            content: '""',
            position: 'absolute',
            left: `${(level - 1) * 16}px`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: theme.palette.grey[300]
          }
        }),

        ...(isParentSelected && level > 1 && {
          bgcolor: theme.palette.grey[300],
          color: theme.palette.grey[500],
          '& .MuiListItemIcon-root': {
            color: theme.palette.grey[500]
          },
          '&:hover': {
            bgcolor: theme.palette.grey[300],
            color: theme.palette.grey[500],
            '& .MuiListItemIcon-root': {
              color: theme.palette.grey[500]
            }
          }
        })
      })}
    >
      <ButtonBase 
        aria-label="theme-icon" 
        sx={(theme) => ({
          borderRadius: `${borderRadius}px`,
          width: (!drawerOpen && level === 1) ? '100%' : 'auto',
          display: 'flex',
          flexDirection: (!drawerOpen && level === 1) ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center'
        })} 
        disableRipple={drawerOpen}
      >
        <ListItemIcon
          sx={(theme) => ({
            minWidth: level === 1 ? 36 : 18,
            color: (isSelected || (isParentSelected && level > 1)) ? theme.palette.grey[500] : theme.palette.text.primary,
            marginRight: (!drawerOpen && level === 1) ? 0 : 2,
            transition: 'color 0.2s ease-in-out',
            ...(!drawerOpen &&
              level === 1 && {
                borderRadius: `${borderRadius}px`,
                width: 46,
                height: 46,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: theme.palette.grey[300],
                  color: theme.palette.grey[900],
                  '& + .MuiTypography-root': {
                    color: theme.palette.grey[900],
                    fontWeight: 700,
                    fontStyle: 'italic'
                  }
                },
                ...(isSelected && {
                  bgcolor: theme.palette.grey[300],
                  color: theme.palette.grey[900],
                  '&:hover': {
                    bgcolor: theme.palette.grey[300],
                    color: theme.palette.grey[900]
                  },
                  '& + .MuiTypography-root': {
                    color: theme.palette.grey[900],
                    fontWeight: 700,
                    fontStyle: 'italic'
                  }
                })
              })
          })}
        >
          {itemIcon}
        </ListItemIcon>

        {(!drawerOpen && level === 1) ? (
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              fontSize: '0.625rem',
              lineHeight: 1.2,
              marginTop: '4px',
              display: 'block',
              width: '100%',
              color: (isSelected || (isParentSelected && level > 1)) ? theme.palette.grey[900] : theme.palette.text.primary,
              fontWeight: (isSelected || (isParentSelected && level > 1)) ? 700 : 500,
              fontStyle: (isSelected || (isParentSelected && level > 1)) ? 'italic' : 'normal',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: theme.palette.grey[900],
                fontWeight: 700,
                fontStyle: 'italic'
              }
            }}
          >
            {item.title}
          </Typography>
        ) : (drawerOpen || (!drawerOpen && level !== 1)) && (
          <Tooltip title={item.title} disableHoverListener={!hoverStatus}>
            <ListItemText
              primary={
                <Typography
                  ref={ref}
                  noWrap
                  variant={isSelected ? 'h5' : 'body1'}
                  color="inherit"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: 102,
                    color: theme.palette.grey[900],
                    fontWeight: (isSelected || (isParentSelected && level > 1)) ? 700 : 500,
                    fontStyle: (isSelected || (isParentSelected && level > 1)) ? 'italic' : 'normal',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {item.title}
                </Typography>
              }
              secondary={
                item.caption && (
                  <Typography 
                    variant="caption" 
                    gutterBottom 
                    sx={{ 
                      display: 'block', 
                      ...theme.typography.subMenuCaption,
                      color: (isSelected || (isParentSelected && level > 1)) ? theme.palette.grey[900] : theme.palette.text.secondary,
                      fontWeight: (isSelected || (isParentSelected && level > 1)) ? 600 : 400,
                      fontStyle: (isSelected || (isParentSelected && level > 1)) ? 'italic' : 'normal',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {item.caption}
                  </Typography>
                )
              }
            />
          </Tooltip>
        )}
      </ButtonBase>

      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          sx={{ 
            ml: 1, 
            position: 'absolute', 
            right: 8,
            '& .MuiChip-label': {
              color: (isSelected || (isParentSelected && level > 1)) ? theme.palette.grey[500] : 'inherit'
            }
          }}
        />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  isParents: PropTypes.bool,
  setSelectedID: PropTypes.func,
  openMenuId: PropTypes.string,
  parentId: PropTypes.string
};

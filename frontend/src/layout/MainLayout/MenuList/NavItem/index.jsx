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

export default function NavItem({ item, level, isParents = false, setSelectedID }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);

  const { pathname } = useLocation();
  const { borderRadius } = useConfig();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const isSelected = !!matchPath({ path: item?.link ? item.link : item.url, end: false }, pathname);

  const [hoverStatus, setHover] = useState(false);

  const compareSize = () => {
    const compare = ref.current && ref.current.scrollWidth > ref.current.clientWidth;
    setHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
    window.removeEventListener('resize', compareSize);
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
      setSelectedID();
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
      className={level > 1 ? 'submenu-items' : ''}
      sx={(theme) => ({
        zIndex: 1201,
        borderRadius: `${borderRadius}px`,
        mb: 0.5,
        position: 'relative',
        ...(drawerOpen &&
          level !== 1 && {
            ml: `${level * 16}px`,
            pl: 2
          }),

        ...(!drawerOpen && {
          pl: 1.25
        }),

        ...(drawerOpen &&
          level === 1 && {
            pl: 2,
            '&:hover': {
                bgcolor: theme.palette.grey[300]
            },
            '&.Mui-selected': {
                bgcolor: theme.palette.grey[300],
                color: iconSelectedColor, // se iconSelectedColor for string do tema, tudo certo
              '&:hover': {
                  color: iconSelectedColor,
                  bgcolor: theme.palette.grey[300]
              }
            }
          }),

        ...((!drawerOpen || level !== 1) && {
          py: level === 1 ? 0 : 1,
          '&:hover': {
              bgcolor: 'transparent'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent'
            },
            bgcolor: 'transparent',
            color: theme.palette.grey[800]
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
        })
      })}
    >
      <ButtonBase aria-label="theme-icon" sx={{ borderRadius: `${borderRadius}px` }} disableRipple={drawerOpen}>
        <ListItemIcon
          sx={(theme) => {
            const iconSelectedColor = theme.palette.grey[600];
            return {
              minWidth: level === 1 ? 36 : 18,
              color: isSelected ? iconSelectedColor : theme.palette.text.primary,
              ...(!drawerOpen &&
                level === 1 && {
                  borderRadius: `${borderRadius}px`,
                  width: 46,
                  height: 46,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: theme.palette.grey[300]
                  },
                  ...(isSelected && {
                    bgcolor: theme.palette.grey[300],
                    '&:hover': {
                      bgcolor: theme.palette.grey[300]
                    }
                  })
                })
            };
          }}
        >
          {itemIcon}
        </ListItemIcon>
      </ButtonBase>

      {(drawerOpen || (!drawerOpen && level !== 1)) && (
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
                    width: 102
                }}
              >
                {item.title}
              </Typography>
            }
            secondary={
              item.caption && (
                <Typography variant="caption" gutterBottom sx={{ display: 'block', ...theme.typography.subMenuCaption }}>
                  {item.caption}
                </Typography>
              )
            }
          />
        </Tooltip>
      )}

      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = { item: PropTypes.any, level: PropTypes.number, isParents: PropTypes.bool, setSelectedID: PropTypes.func };

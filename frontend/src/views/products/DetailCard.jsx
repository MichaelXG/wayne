import { Box, Card, CardContent, Chip, Rating, Stack, Tooltip, Typography, Divider, Button, InputBase, IconButton } from '@mui/material';
import { useState, useMemo } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ImageCarousel from '../../ui-component/carousel/ImageCarousel';
import { useNavigate } from 'react-router-dom';
import { saveOrderToLocalStorage } from '../../hooks/useLocalOrder';
import { isDebug } from '../../App';
import { useTheme } from '@mui/material/styles';

export default function DetailCard({
  id,
  title,
  status,
  isNew = false,
  images = [],
  category,
  description,
  code,
  sku,
  gender,
  quantity,
  price,
  rating,
  is_active = false
}) {
  const theme = useTheme();
  const initialAvailable = useMemo(() => quantity || 0, [quantity]);
  const [available, setAvailable] = useState(initialAvailable);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const originalStock = quantity;

  const isAvailable = is_active && available > 0;

  const navigate = useNavigate();

  const handleIncrease = () => {
    if (selectedQuantity < available) {
      setSelectedQuantity(selectedQuantity + 1);
      setAvailable((prev) => prev - 1);
    }
  };

  const handleDecrease = () => {
    if (selectedQuantity > 0) {
      setSelectedQuantity(selectedQuantity - 1);
      setAvailable((prev) => prev + 1);
    }
  };

  const handleAddOrBuy = (navigateOnBuy = false) => {
    // ✅ Validações básicas
    if (!id || !title || !sku || !price?.sale || !images?.length) {
      console.warn('❌ Dados incompletos do produto. Ordem não será salva.');
      return;
    }

    if (typeof selectedQuantity !== 'number' || selectedQuantity <= 0) {
      console.warn('⚠️ Quantidade selecionada inválida ou zero. Ordem não será salva.');
      return;
    }

    if (!is_active || available <= 0) {
      console.warn('⚠️ Produto inativo ou fora de estoque. Ordem não será salva.');
      return;
    }

    // ✅ Construção segura do item
    let rawImage = images?.[0]?.url || images?.image || '';
    const image = rawImage?.startsWith('http') ? rawImage : `${BASE_URL}${rawImage}`;

    const item = {
      id: id,
      title: title,
      sku: sku,
      quantity: selectedQuantity,
      stock: originalStock,
      price: Number(price.sale),
      image
    };

    // ✅ Salva apenas se todos os dados forem válidos
    const savedOrder = saveOrderToLocalStorage({
      status: 'pending',
      items: [item]
    });

    if (savedOrder) {
      isDebug && console.log('✅ Ordem salva com sucesso:', savedOrder);
      // Zera quantidade e bloqueia botões
      setSelectedQuantity(0);
      setAvailable((prev) => prev - selectedQuantity);
      if (navigateOnBuy) navigate('/checkout');
    } else {
      console.warn('❌ Ordem não foi salva.');
    }
  };

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        backgroundColor: theme.palette.background.default
      })}
    >
      <Box sx={{ width: '100%', maxWidth: 1000 }}>
        {id && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`ID: ${id}`}
              size="small"
              sx={(theme) => ({
                fontWeight: 600,
                fontSize: '0.75rem',
                color: theme.palette.common.white,
                backgroundColor: theme.palette.grey[600],
                width: 'fit-content'
              })}
            />
          </Box>
        )}

        <Card
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            borderRadius: 3,
            boxShadow: 4,
            maxWidth: 1000,
            width: '100%',
            p: 3
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <ImageCarousel images={images} />
          </Box>

          <CardContent
            sx={{
              p: 0,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Stack spacing={2}>
                  <Stack spacing={1} alignItems="flex-start" width="100%">
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      {isNew && (
                        <Chip
                          label="NEW"
                          size="small"
                          color="primary"
                          sx={(theme) => ({
                            fontWeight: theme.typography.fontWeightBold,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.common.white
                          })}
                        />
                      )}
                      <Chip
                        label={is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={(theme) => ({
                          fontWeight: theme.typography.fontWeightBold,
                          bgcolor: theme.palette[is_active ? 'success' : 'error'].dark,
                          color: theme.palette.common.white
                        })}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={(theme) => ({
                        color: theme.palette.success.main
                      })}
                    >
                      {status}
                    </Typography>
                  </Stack>

                  <Typography variant="h4" fontWeight="bold">
                    {title}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title={`Rating: ${rating?.rate}/5`} placement="top" arrow>
                      <Box display="inline-block">
                        <Rating value={rating?.rate} precision={0.1} readOnly size="medium" />
                      </Box>
                    </Tooltip>
                    <Typography
                      variant="caption"
                      sx={(theme) => ({
                        color: theme.palette.text.secondary
                      })}
                    >
                      ({rating?.count} reviews)
                    </Typography>
                  </Box>

                  <Typography
                    variant="h3"
                    sx={(theme) => ({
                      color: theme.palette.primary.main,
                      fontWeight: theme.typography.fontWeightBold
                    })}
                  >
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2
                    }).format(price?.sale)}
                  </Typography>

                  <Box display="flex" alignItems="center">
                    <Tooltip title="Category" placement="top" arrow>
                      <Typography
                        variant="subtitle1"
                        sx={(theme) => ({
                          color: theme.palette.text.secondary
                        })}
                      >
                        {' '}
                        {category}
                      </Typography>
                    </Tooltip>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Tooltip title="Description" placement="top" arrow>
                      <Typography
                        variant="body1"
                        sx={(theme) => ({
                          color: theme.palette.text.secondary,
                          whiteSpace: 'pre-line'
                        })}
                      >
                        {' '}
                        {description}
                      </Typography>
                    </Tooltip>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Tooltip title="Gender" placement="top" arrow>
                      <Chip
                        label={gender}
                        variant="outlined"
                        size="small"
                        sx={(theme) => ({
                          fontWeight: theme.typography.fontWeightMedium,
                          textTransform: 'capitalize',
                          color: theme.palette.grey[600],
                          borderColor: theme.palette.grey[600]
                        })}
                      />
                    </Tooltip>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.57 }}>
                      Quantity
                    </Typography>

                    <Box
                      display="flex"
                      alignItems="center"
                      sx={(theme) => ({
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        px: 1,
                        py: 0.5,
                        boxShadow:
                          theme.customShadows?.z1 ||
                          '0px 2px 1px -1px rgba(145, 158, 171, 0.2), 0px 1px 1px 0px rgba(145, 158, 171, 0.14), 0px 1px 3px 0px rgba(145, 158, 171, 0.12)',
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary
                      })}
                    >
                      <IconButton onClick={handleDecrease} size="small" disabled={!isAvailable || selectedQuantity === 0}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <InputBase
                        type="number"
                        value={selectedQuantity}
                        inputProps={{ min: 0, max: available + selectedQuantity }}
                        onChange={(e) => {
                          if (!isAvailable) return;
                          const val = Math.max(0, Math.min(available + selectedQuantity, Number(e.target.value)));
                          setAvailable((prev) => prev + selectedQuantity - val);
                          setSelectedQuantity(val);
                        }}
                        sx={(theme) => ({
                          width: 40,
                          textAlign: 'center',
                          px: 1,
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          fontFamily: theme.typography.fontFamily
                        })}
                        disabled={!isAvailable}
                      />

                      <IconButton onClick={handleIncrease} size="small" disabled={!isAvailable || selectedQuantity >= originalStock}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Stack>

                  <Box width="100%">
                    <Typography
                      variant="caption"
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        textAlign: 'right',
                        display: 'block'
                      })}
                    >
                      Available: {available} of {originalStock}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            <Box mt={4}>
              <Divider sx={{ mb: 3 }} />
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  startIcon={<ShoppingCartIcon />}
                  sx={(theme) => ({
                    flex: 1
                    // backgroundColor: theme.palette.grey[300],
                    // color: theme.palette.common.white,
                    // '&:hover': {
                    //   backgroundColor: theme.palette.grey[600]
                    // }
                  })}
                  onClick={() => handleAddOrBuy(false)}
                  disabled={!isAvailable || selectedQuantity === 0}
                >
                  Add to cart
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  type="submit"
                  sx={(theme) => ({
                    flex: 1,
                    '&.Mui-disabled': {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled
                    }
                  })}
                  disabled={true} // {!isAvailable || selectedQuantity === 0}
                  onClick={() => handleAddOrBuy(true)}
                >
                  Buy now
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

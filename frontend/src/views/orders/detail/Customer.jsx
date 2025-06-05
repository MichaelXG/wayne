import React, { useMemo } from 'react';
import { BaseDir, customSvgEditIcon, isDebug } from '../../../App';
import { useOrderIDContext } from '../../../contexts/OrderIDContext';
import useFetchData from '../../../hooks/useFetchData';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { API_ROUTES } from '../../../routes/ApiRoutes';
import DefaultCardLayout from '../card/DefaultCardLayout';
import UserAvatarUpload from '../../../ui-component/image/UserAvatarUpload';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useUserData from '../../../hooks/useUserData';
import { formatPhone, maskCPFGPT } from '../../../utils/validator';
import useOrderLockStatus from '../../../hooks/useOrderLockStatus';

export default function DetailCustomer() {
  isDebug && console.log('Customer info renderizado');

  const checkingAuth = useAuthGuard();
  const { orderId } = useOrderIDContext();
  const { data: order } = useFetchData(`${API_ROUTES.ORDERS}${orderId}/`);
  const user_id = order?.user?.id || '';

  const { data: avatar } = useFetchData(`${API_ROUTES.AVATARS}me/?id=${user_id}`);
  const user_avatar = avatar?.image || null;

  const { userData } = useUserData(user_id);
  const name_user = userData?.first_name && userData?.last_name ? `${userData.first_name} ${userData.last_name}` : 'N/A';
  const email_user = userData?.email || null;
  const cpf_user = userData?.cpf || null;
  const phone_user = userData?.phone || null;

  const { canEdit } = useOrderLockStatus(orderId);

  const actionbutton = useMemo(
    () => ({
      label: 'Edit',
      href: `/customer/edit/${user_id}`,
      icon: customSvgEditIcon,
      disabled: !canEdit,
      permission: { menu: 'orders', action: 'can_update' },
    }),
    [canEdit, user_id]
  );

  if (checkingAuth) return null;

  return (
    <DefaultCardLayout subCardTitle="Customer info" actionbutton={actionbutton}>
      <Grid container spacing={4} alignItems="center" justifyContent="flex-start" sx={{ p: 2 }} wrap="nowrap">
        <Grid
          item
          xs={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <UserAvatarUpload initialImage={user_avatar} readOnly />
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {name_user}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {email_user || 'N/A'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {maskCPFGPT(cpf_user)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formatPhone(phone_user)}
          </Typography>
        </Grid>
      </Grid>
    </DefaultCardLayout>
  );
}

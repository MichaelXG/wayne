import { IconClockHour4, IconCheck, IconPackage, IconTruckDelivery, IconBan } from '@tabler/icons-react';

export const statusIcons = {
  pending: IconClockHour4,
  paid: IconCheck,
  processing: IconPackage,
  shipped: IconTruckDelivery,
  canceled: IconBan,
  completed: IconCheck
};

export const statusColors = {
  pending: 'warning',
  paid: 'success',
  processing: 'info',
  shipped: 'primary',
  canceled: 'error',
  completed: 'success'
};

import { IconClockHour4, IconCheck, IconPackage, IconTruckDelivery, IconBan } from '@tabler/icons-react';

export const statusIcons = {
  pending: <IconClockHour4 size={16} />,
  paid: <IconCheck size={16} />,
  processing: <IconPackage size={16} />,
  shipped: <IconTruckDelivery size={16} />,
  canceled: <IconBan size={16} />,
  completed: <IconCheck size={16} />
};

export const statusColors = {
  pending: 'warning',
  paid: 'success',
  processing: 'info',
  shipped: 'primary',
  canceled: 'error',
  completed: 'success'
};

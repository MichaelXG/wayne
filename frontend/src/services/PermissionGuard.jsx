import PropTypes from 'prop-types';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useState } from 'react';
import DynamicModal from '../ui-component/modal/DynamicModal';

/**
 * Component to protect UI based on user permissions.
 *
 * @param {string} menu - Menu name related to the permission.
 * @param {string} action - Expected action (e.g., can_read, can_create, etc.).
 * @param {ReactNode} children - Rendered if permission is granted.
 * @param {boolean} showModal - Show modal as feedback if no permission.
 * @param {ReactNode} fallback - Fallback if permission is denied.
 */
export default function PermissionGuard({
  menu,
  action = 'can_read',
  children,
  fallback = null,
  showModal = false
}) {
  const { hasPermission } = usePermissions();
  const [open, setOpen] = useState(true);

  const allowed = typeof hasPermission === 'function' ? hasPermission(menu, action) : false;

  if (allowed) return children;

  if (showModal) {
    return (
      <DynamicModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}
        title="Permission Denied"
        description={`You need the "${action}" permission on the "${menu}" module to access this resource.`}
        type="warning"
        mode="confirm"
        submitLabel="Understood"
        loading={false}
      />
    );
  }

  return fallback ?? null;
}

PermissionGuard.propTypes = {
  menu: PropTypes.string.isRequired,
  action: PropTypes.string,
  children: PropTypes.node,
  fallback: PropTypes.node,
  showModal: PropTypes.bool
};

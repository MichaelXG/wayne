export const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables.');
}

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/accounts/login/`,
  RECOVER_PASSWORD: `${API_BASE_URL}/auth/recover-password/`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password/`,
  TOKEN_VALIDATION: `${API_BASE_URL}/validate-token/`,
  USERS: `${API_BASE_URL}/accounts/users/`,
  PRODUCTS: `${API_BASE_URL}/products/`,
  ORDERS: `${API_BASE_URL}/orders/`,
  TOTAL_EARNING: `${API_BASE_URL}/total-earning/`,
  TOTAL_ORDERS: `${API_BASE_URL}/total-orders/`,
  TOTAL_INCOME: `${API_BASE_URL}/total-income/`,
  ORDERS_BY_STATUS: `${API_BASE_URL}/orders-by-status/`,
  ORDERS_GROWTH_STATUS: `${API_BASE_URL}/orders-growth-status/`,
  ORDERS_DELIVERY: `${API_BASE_URL}/order-delivery/`,
  ORDERS_SHIPPING: `${API_BASE_URL}/order-shipping/`,
  ORDERS_PAYMENT: `${API_BASE_URL}/order-payment/`,
  AVATARS: `${API_BASE_URL}/accounts/avatars/`,
  WALLETS: `${API_BASE_URL}/wallets/`,
  WALLETS_SEND_CSC_WHATSAPP: (id: string | number) => `${API_BASE_URL}/wallets/${id}/send-csc-whatsapp/`,
  WALLETS_SEND_CSC_EMAIL: (id: string | number) => `${API_BASE_URL}/wallets/${id}/send-csc-email/`,
  WALLETS_VERIFY_CSC: (id: string | number) => `${API_BASE_URL}/wallets/${id}/verify-csc/`,
  CARRIER: `${API_BASE_URL}/carrier/`,
  ADDRESS: `${API_BASE_URL}/address/`,
  GROUPS: `${API_BASE_URL}/permissions/groups/`,
  MY_PERMISSIONS: `${API_BASE_URL}/permissions/my-permissions/`,
  PREMISSIONS_TREE: `${API_BASE_URL}/permissions/treeview-permissions/`,
  SAVE_PERMISSIONS: `${API_BASE_URL}/permissions/save/`,

};



// export const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL;

// if (!API_BASE_URL) {
//   throw new Error('API_BASE_URL is not defined in environment variables.');
// }

// export const API_ROUTES = {
//   AUTH: {
//     LOGIN: `${API_BASE_URL}/accounts/login/`,
//     RECOVER_PASSWORD: `${API_BASE_URL}/auth/recover-password/`,
//     RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password/`,
//     TOKEN_VALIDATION: `${API_BASE_URL}/validate-token/`
//   },

//   USERS: {
//     BASE: `${API_BASE_URL}/accounts/users/`,
//     AVATARS: `${API_BASE_URL}/accounts/avatars/`
//   },

//   PERMISSIONS: {
//     GROUPS: `${API_BASE_URL}/permissions/groups/`,
//     MY: `${API_BASE_URL}/permissions/my-permissions/`,
//     TREE: `${API_BASE_URL}/permissions/treeview-permissions/`,
//     SAVE: `${API_BASE_URL}/permissions/save/`
//   },

//   PRODUCTS: `${API_BASE_URL}/products/`,
//   ORDERS: {
//     BASE: `${API_BASE_URL}/orders/`,
//     DELIVERY: `${API_BASE_URL}/order-delivery/`,
//     SHIPPING: `${API_BASE_URL}/order-shipping/`,
//     PAYMENT: `${API_BASE_URL}/order-payment/`,
//     BY_STATUS: `${API_BASE_URL}/orders-by-status/`,
//     GROWTH: `${API_BASE_URL}/orders-growth-status/`
//   },

//   STATS: {
//     TOTAL_EARNING: `${API_BASE_URL}/total-earning/`,
//     TOTAL_ORDERS: `${API_BASE_URL}/total-orders/`,
//     TOTAL_INCOME: `${API_BASE_URL}/total-income/`
//   },

//   WALLET: {
//     BASE: `${API_BASE_URL}/wallets/`,
//     SEND_CSC_WHATSAPP: (id: string | number) => `${API_BASE_URL}/wallets/${id}/send-csc-whatsapp/`,
//     SEND_CSC_EMAIL: (id: string | number) => `${API_BASE_URL}/wallets/${id}/send-csc-email/`,
//     VERIFY_CSC: (id: string | number) => `${API_BASE_URL}/wallets/${id}/verify-csc/`
//   },

//   CARRIER: `${API_BASE_URL}/carrier/`,
//   ADDRESS: `${API_BASE_URL}/address/`
// };

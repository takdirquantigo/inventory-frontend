const ROLE_DASHBOARD = {
  admin: '/admin/dashboard',
  customer: '/customer/dashboard',
};

function parseStoredRole(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.role ?? null;
  } catch {
    return null;
  }
}

export function getDashboardPathByRole() {
  const adminToken = localStorage.getItem('token');
  if (adminToken) {
    return ROLE_DASHBOARD[parseStoredRole('user') ?? 'admin'] ?? ROLE_DASHBOARD.admin;
  }

  const customerToken = localStorage.getItem('customer_token');
  if (customerToken) {
    return ROLE_DASHBOARD[parseStoredRole('customer') ?? 'customer'] ?? ROLE_DASHBOARD.customer;
  }

  return null;
}

function getOrderTokenStorageKey(orderId) {
  if (orderId === undefined || orderId === null || String(orderId).trim() === '') {
    throw new Error('Order ID is required');
  }
  return `order_token_${String(orderId)}`;
}

function getValidCreatedOrderId(response) {
  const candidate = response?.order_id ?? response?.order?.order_id ?? response?.order?.id;
  const orderId = String(candidate ?? '').trim();
  return /^\\d{1,20}$/.test(orderId) ? orderId : null;
}

function canAccessOrderDetails(isAuthenticated, hasGuestToken) {
  return Boolean(isAuthenticated || hasGuestToken);
}

module.exports = { getOrderTokenStorageKey, getValidCreatedOrderId, canAccessOrderDetails };

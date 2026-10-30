function getOrderTokenStorageKey(orderId) {
  if (orderId === undefined || orderId === null || String(orderId).trim() === '') {
    throw new Error('Order ID is required');
  }
  return `order_token_${String(orderId)}`;
}

function canAccessOrderDetails(isAuthenticated, hasGuestToken) {
  return Boolean(isAuthenticated || hasGuestToken);
}

module.exports = { getOrderTokenStorageKey, canAccessOrderDetails };

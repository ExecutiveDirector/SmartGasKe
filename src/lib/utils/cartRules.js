/**
 * Pure cart mutation rules shared by the cart provider and regression tests.
 * No React state or browser APIs are used here.
 */
function addProductToCart(currentCart, product, outlet, quantity = 1) {
  if (!product || (!product.id && !product.product_id)) {
    return { ok: false, message: 'Product ID is missing' };
  }
  if (!product.name && !product.title && !product.product_name) {
    return { ok: false, message: 'Product name is missing' };
  }
  if (!Number.isFinite(Number(product.price)) || Number(product.price) <= 0) {
    return { ok: false, message: 'Product price is invalid' };
  }
  if (!outlet || (!outlet.id && !outlet.outlet_id)) {
    return { ok: false, message: 'Outlet information is missing for this product' };
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, message: 'Quantity must be at least one' };
  }

  const productId = String(product.id || product.product_id);
  const outletId = String(outlet.id || outlet.outlet_id);
  const existingIndex = currentCart.findIndex((item) =>
    String(item.id || item.product_id) === productId &&
    String(item.outlet?.id || item.outlet?.outlet_id) === outletId
  );

  if (existingIndex >= 0) {
    const existing = currentCart[existingIndex];
    const nextQuantity = existing.quantity + quantity;
    const stockLimit = product.stock ?? Infinity;
    if (nextQuantity > stockLimit) {
      return { ok: false, message: `Only ${product.stock} items available in stock` };
    }

    const nextCart = currentCart.map((item, index) =>
      index === existingIndex
        ? { ...item, ...product, id: productId, outlet: { ...outlet, id: outletId }, quantity: nextQuantity }
        : item
    );
    return {
      ok: true,
      cart: nextCart,
      priceChanged: existing.price !== product.price,
    };
  }

  if (currentCart.length > 0) {
    const currentOutletId = String(currentCart[0].outlet?.id || currentCart[0].outlet?.outlet_id);
    if (currentOutletId !== outletId) {
      const currentOutletName = currentCart[0].outlet?.name || currentCart[0].outlet?.outlet_name || 'another outlet';
      const requestedOutletName = outlet.name || outlet.outlet_name || 'this outlet';
      return {
        ok: false,
        message: `Your cart contains items from ${currentOutletName}. Please checkout or clear your cart before adding items from ${requestedOutletName}.`,
      };
    }
  }

  const stockLimit = product.stock ?? Infinity;
  if (quantity > stockLimit) {
    return { ok: false, message: `Only ${product.stock} items available in stock` };
  }

  return {
    ok: true,
    cart: [...currentCart, {
      ...product,
      id: productId,
      outlet: { ...outlet, id: outletId },
      quantity,
    }],
    priceChanged: false,
  };
}

module.exports = { addProductToCart };

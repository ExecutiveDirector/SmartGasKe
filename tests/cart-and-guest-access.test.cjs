const test = require('node:test');
const assert = require('node:assert/strict');
const { addProductToCart } = require('../src/lib/utils/cartRules');
const { getOrderTokenStorageKey, getValidCreatedOrderId, canAccessOrderDetails } = require('../src/lib/utils/guestOrderAccess');

const outletA = { id: 'outlet-1', name: 'Rongai Gas' };
const outletB = { id: 'outlet-2', name: 'Karen Gas' };
const product = { id: 'product-1', name: '6kg Gas Refill', price: 1200, stock: 5 };

test('adds a product with the requested quantity', () => {
  const result = addProductToCart([], product, outletA, 2);
  assert.equal(result.ok, true);
  assert.equal(result.cart.length, 1);
  assert.equal(result.cart[0].quantity, 2);
});

test('rejects products from a different outlet without mutating the cart', () => {
  const initial = addProductToCart([], product, outletA).cart;
  const result = addProductToCart(initial, { ...product, id: 'product-2' }, outletB);
  assert.equal(result.ok, false);
  assert.match(result.message, /cart contains items from Rongai Gas/);
  assert.equal(initial.length, 1);
});

test('rejects quantities above available stock', () => {
  const result = addProductToCart([], product, outletA, 6);
  assert.equal(result.ok, false);
  assert.match(result.message, /Only 5 items/);
});

test('increments an existing product and reports a changed price', () => {
  const initial = addProductToCart([], product, outletA).cart;
  const result = addProductToCart(initial, { ...product, price: 1300 }, outletA, 2);
  assert.equal(result.ok, true);
  assert.equal(result.cart[0].quantity, 3);
  assert.equal(result.cart[0].price, 1300);
  assert.equal(result.priceChanged, true);
});

test('rejects invalid quantities and prices', () => {
  assert.equal(addProductToCart([], product, outletA, 0).ok, false);
  assert.equal(addProductToCart([], { ...product, price: 0 }, outletA).ok, false);
});

test('guest order token keys are scoped to an order ID', () => {
  assert.equal(getOrderTokenStorageKey('12345'), 'order_token_12345');
  assert.throws(() => getOrderTokenStorageKey(''));
});

test('only authenticated customers or token-authorized guests can view order details', () => {
  assert.equal(canAccessOrderDetails(false, false), false);
  assert.equal(canAccessOrderDetails(false, true), true);
  assert.equal(canAccessOrderDetails(true, false), true);
});

test('created order IDs must be real numeric backend IDs', () => {
  assert.equal(getValidCreatedOrderId({ order_id: 12345 }), '12345');
  assert.equal(getValidCreatedOrderId({ order: { id: 42 } }), '42');
  assert.equal(getValidCreatedOrderId({ order_id: 'ORD-123' }), null);
  assert.equal(getValidCreatedOrderId({ success: true }), null);
});

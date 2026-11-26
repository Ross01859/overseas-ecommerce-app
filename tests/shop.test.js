import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanCart,
  products,
  price,
  total,
  shippingFee,
  filterPrints,
} from "../src/shop.js";

test("same print and size merge, different sizes stay separate", () => {
  const cart = cleanCart([
    { id: "sundown", size: "small", qty: 1 },
    { id: "sundown", size: "large", qty: 1 },
    { id: "sundown", size: "small", qty: 2 },
  ]);
  assert.deepEqual(
    cart.map((r) => r.qty),
    [3, 1],
  );
  assert.equal(total(cart), 14400);
});
test("malformed storage, foreign IDs and invalid quantities are discarded", () => {
  assert.deepEqual(cleanCart({}), []);
  assert.deepEqual(
    cleanCart([
      null,
      { id: "ghost", size: "small", qty: 2 },
      { id: "sundown", size: "x", qty: 1 },
      { id: "sundown", size: "small", qty: -1 },
      { id: "sundown", size: "small", qty: 1.5 },
    ]),
    [],
  );
});
test("quantity caps and price in minor units", () => {
  assert.equal(
    cleanCart([{ id: "sundown", size: "small", qty: 90 }])[0].qty,
    10,
  );
  assert.equal(price(products[1], "large"), 5200);
});
test("free shipping begins exactly at the threshold", () => {
  assert.deepEqual([0, 7499, 7500, 7501].map(shippingFee), [0, 900, 0, 0]);
});
test("search, category, saved filter and price order compose", () => {
  const opts = {
    category: "Botanical",
    query: "  ",
    sort: "low",
    onlySaved: false,
    saved: [],
  };
  assert.deepEqual(
    filterPrints(opts).map((p) => p.id),
    ["citrus-study", "slow-bloom"],
  );
  assert.deepEqual(
    filterPrints({
      ...opts,
      query: " Citrus  STUDY ",
      onlySaved: true,
      saved: ["citrus-study"],
    }).map((p) => p.id),
    ["citrus-study"],
  );
  assert.equal(filterPrints({ ...opts, query: "Lunar telescope" }).length, 0);
});

export const products = [
  {
    id: "sundown",
    name: "Sundown",
    category: "Landscape",
    base: 3200,
    tone: "#e7b2a2",
    description:
      "A coral sun sinks into layers of desert ridgelines. Warm ochre and dusty rose bring the last light of the day indoors.",
  },
  {
    id: "night-swim",
    name: "Night Swim",
    category: "Abstract",
    base: 3600,
    tone: "#b7c7d1",
    description:
      "A study in poolside blues. Curved lines and tiled geometry recall the quiet of a swimming pool after hours.",
  },
  {
    id: "citrus-study",
    name: "Citrus Study",
    category: "Botanical",
    base: 2800,
    tone: "#d6d3aa",
    description:
      "Ripe oranges and deep green leaves share an airy composition inspired by the produce stands of the Mediterranean.",
  },
  {
    id: "slow-bloom",
    name: "Slow Bloom",
    category: "Botanical",
    base: 3400,
    tone: "#dfb9c4",
    description:
      "An oversized pink blossom unfolds against a rich red field. Bold, graphic petals turn a single stem into a statement.",
  },
  {
    id: "tideline",
    name: "Tideline",
    category: "Landscape",
    base: 3200,
    tone: "#b5c9ca",
    description:
      "Bands of indigo trace the rhythm of the coast. Layered waves lend a little movement to a quiet corner.",
  },
  {
    id: "soft-geometry",
    name: "Soft Geometry",
    category: "Abstract",
    base: 3000,
    tone: "#d9c7b4",
    description:
      "Earth-toned forms meet in a geometric arrangement, balancing hard edges with the warmth of printed paper.",
  },
  {
    id: "midnight-orbit",
    name: "Midnight Orbit",
    category: "Abstract",
    base: 3800,
    tone: "#aab4cd",
    description:
      "Coral shapes drift through a deep navy sky. A graphic interpretation of planetary motion after dark.",
  },
  {
    id: "alpine-air",
    name: "Alpine Air",
    category: "Landscape",
    base: 3400,
    tone: "#b9c4a8",
    description:
      "Green mountain silhouettes stack into the distance, capturing the stillness of an early alpine morning.",
  },
];
export const sizes = [
  { id: "small", label: "8 × 10 in", metric: "20.3 × 25.4 cm", extra: 0 },
  { id: "large", label: "12 × 15 in", metric: "30.5 × 38.1 cm", extra: 1600 },
];
export const price = (p, sizeId) =>
  p.base + sizes.find((s) => s.id === sizeId).extra;
export const money = (cents) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
export function filterPrints({ category, query, sort, onlySaved, saved }) {
  const words = query.trim().toLowerCase().split(/\s+/);
  const result = products.filter(
    (p) =>
      (category === "All prints" || p.category === category) &&
      (!onlySaved || saved.includes(p.id)) &&
      words.every((w) =>
        [p.name, p.category, p.description].join(" ").toLowerCase().includes(w),
      ),
  );
  if (sort === "low") result.sort((a, b) => a.base - b.base);
  if (sort === "high") result.sort((a, b) => b.base - a.base);
  return result;
}
export const MAX_QTY = 10;
export function cleanCart(value) {
  if (!Array.isArray(value)) return [];
  const rows = [];
  for (const item of value) {
    if (
      !item ||
      !products.some((p) => p.id === item.id) ||
      !sizes.some((s) => s.id === item.size) ||
      !Number.isInteger(item.qty) ||
      item.qty < 1
    )
      continue;
    const row = rows.find((r) => r.id === item.id && r.size === item.size);
    if (row) row.qty = Math.min(MAX_QTY, row.qty + item.qty);
    else
      rows.push({
        id: item.id,
        size: item.size,
        qty: Math.min(MAX_QTY, item.qty),
      });
  }
  return rows;
}
export function total(cart) {
  return cart.reduce(
    (sum, r) =>
      sum +
      price(
        products.find((p) => p.id === r.id),
        r.size,
      ) *
        r.qty,
    0,
  );
}
export const shippingFee = (subtotal) =>
  subtotal >= 7500 || subtotal === 0 ? 0 : 900;

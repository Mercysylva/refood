// Correct double-stroked Naira sign (U+20A6). Single source of truth —
// every price in the app renders through NAIRA / formatNaira below,
// and index.css forces the U+20A6 subset font for this glyph.
export const NAIRA = "₦";

export function formatNaira(n) {
  if (typeof n !== "number") n = Number(n) || 0;
  return NAIRA + n.toLocaleString();
}

// Single source of truth for the selling price.
// Customer cards, cart, checkout and business views must all resolve
// the same value: surplusPrice first, then legacy fallbacks.
export function getListingPrice(l) {
  if (!l) return 0;
  const v = l.surplusPrice ?? l.discountPrice ?? l.price ?? 0;
  return Number(v) || 0;
}

export function getListingOriginalPrice(l) {
  if (!l) return 0;
  const v = l.originalPrice ?? 0;
  return Number(v) || 0;
}

// Price locked in at purchase time (order snapshot).
// `price` is written by createOrder; the rest are legacy fallbacks.
export function getOrderItemPrice(it) {
  if (!it) return 0;
  const v = it.price ?? it.discountPrice ?? it.surplusPrice ?? 0;
  return Number(v) || 0;
}

export function getOrderItemQty(it) {
  if (!it) return 1;
  return it.qty ?? it.quantity ?? 1;
}

// One pickup/delivery code per order, used on every screen so customers never see two different codes.
export function getPickupCode(order) {
  const id = String(order?.id || "");
  return id.replace(/\D/g, "").slice(-7).padStart(7, "7").slice(0, 7) || "7328145";
}

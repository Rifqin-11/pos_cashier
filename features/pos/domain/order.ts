import type { Item, Order, Product, Settings, Totals, Voucher } from "./types";

export function createOrder(id: string): Order {
  return {
    id,
    items: [],
    customer: "",
    table: "",
    type: "Dine In",
    voucher: "",
    note: "",
  };
}

export function createItem(product: Product, id: string): Item {
  return {
    id,
    productId: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    quantity: 1,
    temperature:
      product.category === "Pastry & Bites" ||
      product.category === "Ricebowl" ||
      product.category === "Noodle"
        ? "Hangat"
        : "Iced",
    size: "Regular",
    sugar: "Normal",
    extra: false,
    note: "",
  };
}

export const unitPrice = (item: Item) =>
  item.price + (item.size === "Large" ? 5000 : 0) + (item.extra ? 6000 : 0);
export const itemCount = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.quantity, 0);

export type VoucherIssue = "not-found" | "inactive" | "expired" | "minimum";
export function validateVoucher(
  voucher: Voucher | undefined,
  subtotal: number,
  now: Date,
): VoucherIssue | null {
  if (!voucher) return "not-found";
  if (!voucher.active) return "inactive";
  if (new Date(`${voucher.expires}T23:59:59`).getTime() < now.getTime())
    return "expired";
  if (subtotal < voucher.minimum) return "minimum";
  return null;
}

export function calculate(
  order: Order,
  settings: Pick<Settings, "tax" | "service">,
  vouchers: readonly Voucher[],
  now: Date,
): Totals {
  const subtotal = order.items.reduce(
    (sum, item) => sum + unitPrice(item) * item.quantity,
    0,
  );
  const voucher = vouchers.find((value) => value.code === order.voucher);
  const discount =
    voucher && !validateVoucher(voucher, subtotal, now)
      ? Math.min(
          subtotal,
          voucher.type === "percent"
            ? Math.round((subtotal * voucher.value) / 100)
            : voucher.value,
        )
      : 0;
  const base = subtotal - discount;
  const tax = Math.round((base * settings.tax) / 100);
  const service =
    order.type === "Dine In" ? Math.round((base * settings.service) / 100) : 0;
  return { subtotal, discount, tax, service, total: base + tax + service };
}

export function saveItem(order: Order, item: Item, editing: boolean): Order {
  if (!Number.isInteger(item.quantity) || item.quantity < 1)
    throw new Error("Jumlah item harus lebih dari nol.");
  if (editing)
    return {
      ...order,
      items: order.items.map((value) => (value.id === item.id ? item : value)),
    };
  const same = order.items.find(
    (value) =>
      value.productId === item.productId &&
      value.temperature === item.temperature &&
      value.size === item.size &&
      value.sugar === item.sugar &&
      value.extra === item.extra &&
      value.note === item.note,
  );
  return {
    ...order,
    items: same
      ? order.items.map((value) =>
          value.id === same.id
            ? { ...value, quantity: value.quantity + item.quantity }
            : value,
        )
      : [...order.items, item],
  };
}

export function changeQuantity(
  order: Order,
  id: string,
  amount: number,
): Order {
  return {
    ...order,
    items: order.items
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + amount } : item,
      )
      .filter((item) => item.quantity > 0),
  };
}

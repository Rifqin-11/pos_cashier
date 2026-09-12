export type Category =
  "Semua menu" | "Coffee" | "Tea" | "Pastry & Bites" | "Ricebowl" | "Noodle";
export type Payment = "Tunai" | "QRIS" | "Kartu debit";
export type OrderType = "Dine In" | "Take Away";
export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  available: boolean;
  popular?: boolean;
  description: string;
};
export type Item = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  temperature: string;
  size: string;
  sugar: string;
  extra: boolean;
  note: string;
};
export type Order = {
  id: string;
  items: Item[];
  customer: string;
  table: string;
  type: OrderType;
  voucher: string;
  note: string;
};
export type Totals = {
  subtotal: number;
  discount: number;
  tax: number;
  service: number;
  total: number;
};
export type Transaction = Order &
  Totals & {
    shiftId: string;
    cashier: string;
    date: string;
    payment: Payment;
    received: number;
    status: "Lunas" | "Refund";
    refundReason?: string;
    refundedAt?: string;
    refundShiftId?: string;
    reference: string;
  };
export type Shift = {
  id: string;
  cashier: string;
  start: string;
  opening: number;
  end?: string;
  closing?: number;
  expected?: number;
};
export type Settings = {
  receiptPrinter: boolean;
  kitchenPrinter: boolean;
  drawer: boolean;
  tax: number;
  service: number;
  networkFailure: boolean;
  paymentFailure: boolean;
  printerFailure: boolean;
};
export type Store = {
  version: 1;
  session: { name: string; loginAt: string } | null;
  shift: Shift | null;
  shifts: Shift[];
  order: Order;
  held: Order[];
  transactions: Transaction[];
  settings: Settings;
};
export type Voucher = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minimum: number;
  expires: string;
  active: boolean;
  label: string;
  description: string;
};
export type PaymentInput = {
  method: Payment;
  received: number;
  confirmed: boolean;
  reference: string;
};

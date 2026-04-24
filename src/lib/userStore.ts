// Lightweight localStorage-backed store for user orders & reservations.
// Mock-only — coerente com o login fictício "Stilvoll Privé".

export type OrderStatus = "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

export interface StoredOrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface StoredOrder {
  id: string;
  createdAt: number;
  items: StoredOrderItem[];
  total: number;
  address: string;
  status: OrderStatus;
}

export interface StoredReservation {
  id: string;
  createdAt: number;
  name: string;
  unit: string;
  unitLabel: string;
  table: string;
  tableLabel: string;
  guests: number;
  date: string; // ISO
  time: string;
  payment: "local" | "online";
  status: "active" | "cancelled";
}

const ORDERS_KEY = "stilvoll.orders";
const RES_KEY = "stilvoll.reservations";

const read = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

const write = <T,>(key: string, value: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("stilvoll:store-update", { detail: { key } }));
  } catch {
    /* noop */
  }
};

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const orderStore = {
  list: () => read<StoredOrder>(ORDERS_KEY).sort((a, b) => b.createdAt - a.createdAt),
  add: (data: Omit<StoredOrder, "id" | "createdAt" | "status"> & { status?: OrderStatus }) => {
    const order: StoredOrder = {
      id: uid(),
      createdAt: Date.now(),
      status: data.status ?? "pending",
      ...data,
    };
    const all = read<StoredOrder>(ORDERS_KEY);
    write(ORDERS_KEY, [order, ...all]);
    return order;
  },
};

export const reservationStore = {
  list: () => read<StoredReservation>(RES_KEY).sort((a, b) => b.createdAt - a.createdAt),
  add: (data: Omit<StoredReservation, "id" | "createdAt" | "status"> & { status?: StoredReservation["status"] }) => {
    const res: StoredReservation = {
      id: uid(),
      createdAt: Date.now(),
      status: data.status ?? "active",
      ...data,
    };
    const all = read<StoredReservation>(RES_KEY);
    write(RES_KEY, [res, ...all]);
    return res;
  },
  cancel: (id: string) => {
    const all = read<StoredReservation>(RES_KEY);
    const updated = all.map(r => r.id === id ? { ...r, status: "cancelled" as const } : r);
    write(RES_KEY, updated);
  },
};

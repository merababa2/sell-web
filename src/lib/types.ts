export type MenuItemDTO = {
  id: string;
  name: string;
  nameAr: string | null;
  description: string;
  category: string;
  priceFils: number;
  imageUrl: string | null;
  available: boolean;
  popular: boolean;
  sortOrder: number;
};

export type OrderItemDTO = {
  id: string;
  name: string;
  nameAr: string | null;
  qty: number;
  priceFils: number;
};

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderDTO = {
  id: string;
  orderNumber: string;
  source: "dine_in" | "online";
  orderType: "dine_in" | "pickup" | "delivery";
  tableName: string | null;
  customerName: string | null;
  customerPhone: string | null;
  notes: string | null;
  items: OrderItemDTO[];
  totalFils: number;
  status: OrderStatus;
  createdAt: string;
};

export type TableDTO = {
  id: string;
  name: string;
  token: string;
  active: boolean;
};

export type AccessLinkDTO = {
  id: string;
  label: string;
  token: string;
  active: boolean;
};

export const CATEGORIES = [
  "Breakfast",
  "Starters",
  "Soups",
  "Salads",
  "Pizza",
  "Pasta & Mains",
  "Desserts",
  "Coffee & Drinks",
] as const;

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; dot: string; chip: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    chip: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  preparing: {
    label: "Preparing",
    dot: "bg-sky-400",
    chip: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  },
  ready: {
    label: "Ready",
    dot: "bg-emerald-400",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
  completed: {
    label: "Completed",
    dot: "bg-zinc-400",
    chip: "border-zinc-400/30 bg-zinc-400/10 text-zinc-300",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    chip: "border-red-400/30 bg-red-400/10 text-red-300",
  },
};

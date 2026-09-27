import type {
  AccessLinkRow,
  MenuItemRow,
  OrderRow,
  TableRow,
} from "@/db/schema";
import type {
  AccessLinkDTO,
  MenuItemDTO,
  OrderDTO,
  OrderStatus,
  TableDTO,
} from "@/lib/types";

export function menuItemToDTO(r: MenuItemRow): MenuItemDTO {
  return {
    id: r.id,
    name: r.name,
    nameAr: r.nameAr,
    description: r.description ?? "",
    category: r.category,
    priceFils: r.priceFils,
    imageUrl: r.imageUrl,
    available: r.available,
    popular: r.popular,
    sortOrder: r.sortOrder,
  };
}

export function orderToDTO(r: OrderRow): OrderDTO {
  return {
    id: r.id,
    orderNumber: r.orderNumber,
    source: r.source as OrderDTO["source"],
    orderType: r.orderType as OrderDTO["orderType"],
    tableName: r.tableName,
    customerName: r.customerName,
    customerPhone: r.customerPhone,
    notes: r.notes,
    items: (r.items ?? []).map((it) => ({
      id: it.id,
      name: it.name,
      nameAr: it.nameAr ?? null,
      qty: it.qty,
      priceFils: it.priceFils,
    })),
    totalFils: r.totalFils,
    status: r.status as OrderStatus,
    createdAt: r.createdAt.toISOString(),
  };
}

export function tableToDTO(r: TableRow): TableDTO {
  return { id: r.id, name: r.name, token: r.token, active: r.active };
}

export function linkToDTO(r: AccessLinkRow): AccessLinkDTO {
  return { id: r.id, label: r.label, token: r.token, active: r.active };
}

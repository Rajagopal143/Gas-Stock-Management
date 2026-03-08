export type CylinderType = "14.2kg Domestic" | "19kg Commercial";

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  shopName?: string;
  address?: string;
  area?: string;
  notes?: string;
}

export interface Inventory {
  _id: string;
  cylinderType: CylinderType;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
}

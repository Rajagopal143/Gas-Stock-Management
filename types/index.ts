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
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
}

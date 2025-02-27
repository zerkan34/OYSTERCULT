export interface Supplier {
  id: string;
  name: string;
  friend_code: string | null;
  email: string;
  phone: string;
  address: string;
  is_friend: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierProduct {
  id: string;
  supplier_id: string;
  name: string;
  description: string | null;
  unit: string;
  price: number;
  min_order_quantity: number;
  created_at: string;
  updated_at: string;
  category?: string;
}

export interface SupplierOrder {
  id: string;
  supplier_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'delivering' | 'completed';
  total_amount: number;
  delivery_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  storage_location: string | null;
  expiry_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateSupplierDTO extends Partial<CreateSupplierDTO> {
  is_friend?: boolean;
}

export interface CreateSupplierProductDTO {
  supplier_id: string;
  name: string;
  description?: string;
  unit: string;
  price: number;
  min_order_quantity?: number;
}

export interface CreateSupplierOrderDTO {
  supplier_id: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface UpdateSupplierOrderDTO {
  status?: SupplierOrder['status'];
  delivery_date?: string;
  storage_location?: string;
  expiry_date?: string;
}

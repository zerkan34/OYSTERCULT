export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'delivering';

export interface OrderComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface Order {
  id: string;
  supplier_id: string;
  status: OrderStatus;
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    unit: string;
  }[];
  total_amount: number;
  comments: OrderComment[];
  storage_location?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

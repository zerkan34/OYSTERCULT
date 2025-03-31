export interface Order {
  id: string;
  product: string;
  supplier: string;
  deliveryDate: string;
  price: number;
  quantity: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed' | 'dispatched' | 'in_transit' | 'completed';
  icon: any;
  stockLocation: string;
  lastUpdate: string;
}

import { Database } from './supabase';

export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Supplier = Database['public']['Tables']['suppliers']['Row'];
export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'credit_card';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type InvoiceType = 'sale' | 'purchase';

export interface InvoiceWithItems extends Invoice {
  id: string;
  items: InvoiceItem[];
  customer?: Customer;
  supplier?: Supplier;
}

export interface PaymentTerms {
  id: string;
  name: string;
  days: number;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
}
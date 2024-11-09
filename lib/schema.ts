import { Database } from '@/lib/database.types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Freight = Database['public']['Tables']['freight']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type MaintenanceItem = Database['public']['Tables']['maintenance']['Row'];
export type ShippingQuote = Database['public']['Tables']['shippingquotes']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type Vendor = Database['public']['Tables']['vendors']['Row'];
export type PurchaseOrder = Database['public']['Tables']['purchase_order']['Row'];
// Add any other types or interfaces you need here
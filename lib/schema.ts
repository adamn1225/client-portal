import { Database } from '@/lib/database.types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Freight = Database['public']['Tables']['freight']['Row'];
export type FreightInsert = Database['public']['Tables']['freight']['Insert'];
export type FreightUpdate = Database['public']['Tables']['freight']['Update'];

export type Company = Database['public']['Tables']['companies']['Row'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export type MaintenanceItem = Database['public']['Tables']['maintenance']['Row'];
export type MaintenanceItemInsert = Database['public']['Tables']['maintenance']['Insert'];
export type MaintenanceItemUpdate = Database['public']['Tables']['maintenance']['Update'];

export type ShippingQuote = Database['public']['Tables']['shippingquotes']['Row'];
export type ShippingQuoteInsert = Database['public']['Tables']['shippingquotes']['Insert'];
export type ShippingQuoteUpdate = Database['public']['Tables']['shippingquotes']['Update'];

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

export type Vendor = Database['public']['Tables']['vendors']['Row'];
export type VendorInsert = Database['public']['Tables']['vendors']['Insert'];
export type VendorUpdate = Database['public']['Tables']['vendors']['Update'];

export type PurchaseOrder = Database['public']['Tables']['purchase_order']['Row'];
export type PurchaseOrderInsert = Database['public']['Tables']['purchase_order']['Insert'];
export type PurchaseOrderUpdate = Database['public']['Tables']['purchase_order']['Update'];

export type ChromeQuotes = Database['public']['Tables']['chrome_quotes']['Row'];
export type ChromeQuotesInsert = Database['public']['Tables']['chrome_quotes']['Insert'];
export type ChromeQuotesUpdate = Database['public']['Tables']['chrome_quotes']['Update'];
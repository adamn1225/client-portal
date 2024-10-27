export interface Database {
  public: {
    Tables: {
      freight: {
        Row: {
          id: number;
          inserted_at: string;
          is_complete: boolean | null;
          freight_type: string | null;
          make: string | null;
          model: string | null;
          year: string | null;
          pallets: string | null;
          serial_number: string | null;
          dimensions: string | null;
          freight_id: string | null;
          freight_class: string | null;
          status: string | null;
          user_id: string;
          due_date: string | null;
          in_progress: boolean | null;
          reminder_time: string | null;
          year_amount: string | null;
          pallet_count: string | null;
          commodity: string | null;
          length: string | null;
          length_unit: string | null;
          width: string | null;
          width_unit?: string | null;
          height: string | null;
          height_unit?: string | null;
          weight: string | null;
          weight_unit: string | null;
          inventory_number: string | null;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          is_complete?: boolean | null;
          task?: string | null;
          user_id: string;
          due_date?: string | null;
          in_progress?: boolean | null;
          reminder_time?: string | null;
          year_amount?: string | null;
          pallet_count?: string | null;
          commodity?: string | null;
          length?: string | null;
          length_unit?: string | null;
          width?: string | null;
          width_unit?: string | null;
          height?: string | null;
          height_unit?: string | null;
          weight?: string | null;
          weight_unit?: string | null;
          serial_number?: string | null;
          inventory_number?: string | null;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          is_complete?: boolean | null;
          task?: string | null;
          user_id?: string;
          due_date?: string | null;
          in_progress?: boolean | null;
          reminder_time?: string | null;
          year_amount?: string | null;
          pallet_count?: string | null;
          commodity?: string | null;
          length?: string | null;
          length_unit?: string | null;
          width?: string | null;
          width_unit?: string | null;
          height?: string | null;
          height_unit?: string | null;
          weight?: string | null;
          weight_unit?: string | null;
          serial_number?: string | null;
          inventory_number?: string | null;
        };
      };
      shippingquotes: {
        Row: {
          id: number;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          inserted_at: string;
          is_complete: boolean | null;
          origin_city: string | null;
          origin_state: string | null;
          origin_zip: string | null;
          destination_city: string | null;
          destination_state: string | null;
          destination_zip: string | null;
          user_id: string;
          quote_id: string | null;
          due_date: string | null;
          year_amount: string | null;
          make: string | null;
          model: string | null;
          pallet_count: string | null;
          commodity: string | null;
          length: string | null;
          width: string | null;
          height: string | null;
          weight: string | null;
          price: number | null;
          is_archived: boolean | null;
        };
        Insert: {
          id?: number;
          first_name: string | null;
          last_name: string | null;
          email?: string | null;
          inserted_at?: string;
          is_complete?: boolean | null;
          origin_city?: string | null;
          origin_state?: string | null;
          origin_zip?: string | null;
          destination_city?: string | null;
          destination_state?: string | null;
          destination_zip?: string | null;
          user_id: string;
          quote_id?: string | null;
          due_date?: string | null;
          year_amount?: string | null;
          make?: string | null;
          model?: string | null;
          pallet_count?: string | null;
          commodity?: string | null;
          length?: string | null;
          width?: string | null;
          height?: string | null;
          weight?: string | null;
          price: number | null;
          is_archived: boolean | null;
        };
        Update: {
          id?: number;
          first_name: string | null;
          last_name: string | null;
          email?: string | null;
          inserted_at?: string;
          is_complete?: boolean | null;
          origin_city?: string | null;
          origin_state?: string | null;
          origin_zip?: string | null;
          destination_city?: string | null;
          destination_state?: string | null;
          destination_zip?: string | null;
          user_id?: string;
          quote_id?: string | null;
          due_date?: string | null;
          year_amount?: string | null;
          make?: string | null;
          model?: string | null;
          pallet_count?: string | null;
          commodity?: string | null;
          length?: string | null;
          width?: string | null;
          height?: string | null;
          weight?: string | null;
          price: number | null;
          is_archived: boolean | null;
        };
      },
      maintenance: {
        Row: {
          id: number;
          user_id: string;
          freight_id: number;
          urgency: string;
          notes: string;
          need_parts: boolean;
          part: string | null;
          schedule_date: string | null;
          maintenance_crew: string;
          created_at: string;
          make: string | null;
          model: string | null;
          year: string | null;
          year_amount: string | null;
          pallets: string | null;
          serial_number: string | null;
          dimensions: string | null;
          commodity: string | null;
          inventory_number: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          freight_id: number;
          urgency: string;
          notes: string;
          need_parts: boolean;
          part?: string | null;
          schedule_date?: string | null;
          maintenance_crew: string;
          created_at?: string;
          make?: string | null;
          model?: string | null;
          year?: string | null;
          year_amount: string | null;
          pallets?: string | null;
          serial_number?: string | null;
          dimensions?: string | null;
          commodity?: string | null;
          inventory_number: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          freight_id?: number;
          urgency?: string;
          notes?: string;
          need_parts?: boolean;
          part?: string | null;
          schedule_date?: string | null;
          maintenance_crew?: string;
          created_at?: string;
          make?: string | null;
          model?: string | null;
          year?: string | null;
          year_amount: string | null;
          pallets?: string | null;
          serial_number?: string | null;
          dimensions?: string | null;
          commodity?: string | null;
          inventory_number: string | null; 
        };
      },
      orders: {
        Row: {
          id: number;
          quote_id: number;
          user_id: string;
          created_at: string;
          status: string;
          is_archived: boolean;
        };
        Insert: {
          id?: number;
          quote_id: number;
          user_id: string;
          created_at?: string;
          status?: string;
          is_archived?: boolean;
        };
        Update: {
          id?: number;
          quote_id?: number;
          user_id?: string;
          created_at?: string;
          status?: string;
          is_archived?: boolean;
        };
      },
      profiles: {
        Row: {
          id: string;
          email: string;
          inserted_at: string;
          role: string;
          first_name: string | null;
          last_name: string | null;
          company_name: string | null;
          profile_picture: string | null;
          address: string | null;
          phone_number: string | null;
        };
        Insert: {
          id: string;
          email: string;
          inserted_at?: string;
          role: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          profile_picture?: string | null;
          address?: string | null;
          phone_number?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          inserted_at?: string;
          role?: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          profile_picture?: string | null;
          address?: string | null;
          phone_number?: string | null;
        };
      },
      notifications: {
        Row: {
          id: number;
          user_id: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Define the Task type
export type Task = Database['public']['Tables']['freight']['Row'];
export type MaintenanceItem = Database['public']['Tables']['maintenance']['Row'];
export type ShippingQuote = Database['public']['Tables']['shippingquotes']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chrome_quotes: {
        Row: {
          created_at: string | null
          destinationzip: string | null
          email: string | null
          freightdescription: string | null
          height: string | null
          id: number
          length: string | null
          make: string | null
          model: string | null
          name: string | null
          originzip: string | null
          phone: string | null
          quote: number | null
          weight: string | null
          width: string | null
          year: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          destinationzip?: string | null
          email?: string | null
          freightdescription?: string | null
          height?: string | null
          id?: number
          length?: string | null
          make?: string | null
          model?: string | null
          name?: string | null
          originzip?: string | null
          phone?: string | null
          quote?: number | null
          weight?: string | null
          width?: string | null
          year?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          destinationzip?: string | null
          email?: string | null
          freightdescription?: string | null
          height?: string | null
          id?: number
          length?: string | null
          make?: string | null
          model?: string | null
          name?: string | null
          originzip?: string | null
          phone?: string | null
          quote?: number | null
          weight?: string | null
          width?: string | null
          year?: string | null
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          name: string
          size: string
        }
        Insert: {
          id?: string
          name: string
          size: string
        }
        Update: {
          id?: string
          name?: string
          size?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null;
          description: string | null;
          file_name: string;
          file_type: string;
          file_url: string;
          id: number;
          is_favorite: boolean | null;
          title: string;
          user_id: string | null;
          order_id: number | null;
          shippingquote_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          file_name: string;
          file_type: string;
          file_url: string;
          id?: number;
          is_favorite?: boolean | null;
          title: string;
          user_id?: string | null;
          order_id?: number | null;
          shippingquote_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          file_name?: string;
          file_type?: string;
          file_url?: string;
          id?: number;
          is_favorite?: boolean | null;
          title?: string;
          user_id?: string | null;
          order_id?: number | null;
          shippingquote_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "auth.users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_shippingquote_id_fkey";
            columns: ["shippingquote_id"];
            referencedRelation: "shippingquotes";
            referencedColumns: ["id"];
          }
        ];
      };
      freight: {
        Row: {
          commodity: string | null
          dimensions: string | null
          due_date: string | null
          freight_class: string | null
          freight_id: string | null
          freight_type: string | null
          height: string | null
          height_unit: string | null
          id: number
          in_progress: boolean | null
          inserted_at: string | null
          inventory_number: string | null
          is_complete: boolean | null
          length: string | null
          length_unit: string | null
          make: string | null
          model: string | null
          pallet_count: string | null
          pallets: string | null
          reminder_time: string | null
          serial_number: string | null
          status: string | null
          user_id: string | null
          weight: string | null
          weight_unit: string | null
          width: string | null
          width_unit: string | null
          year: string | null
        }
        Insert: {
          commodity?: string | null
          dimensions?: string | null
          due_date?: string | null
          freight_class?: string | null
          freight_id?: string | null
          freight_type?: string | null
          height?: string | null
          height_unit?: string | null
          id?: number
          in_progress?: boolean | null
          inserted_at?: string | null
          inventory_number?: string | null
          is_complete?: boolean | null
          length?: string | null
          length_unit?: string | null
          make?: string | null
          model?: string | null
          pallet_count?: string | null
          pallets?: string | null
          reminder_time?: string | null
          serial_number?: string | null
          status?: string | null
          user_id?: string | null
          weight?: string | null
          weight_unit?: string | null
          width?: string | null
          width_unit?: string | null
          year?: string | null
        }
        Update: {
          commodity?: string | null
          dimensions?: string | null
          due_date?: string | null
          freight_class?: string | null
          freight_id?: string | null
          freight_type?: string | null
          height?: string | null
          height_unit?: string | null
          id?: number
          in_progress?: boolean | null
          inserted_at?: string | null
          inventory_number?: string | null
          is_complete?: boolean | null
          length?: string | null
          length_unit?: string | null
          make?: string | null
          model?: string | null
          pallet_count?: string | null
          pallets?: string | null
          reminder_time?: string | null
          serial_number?: string | null
          status?: string | null
          user_id?: string | null
          weight?: string | null
          weight_unit?: string | null
          width?: string | null
          width_unit?: string | null
          year?: string | null
        }
        Relationships: []
      }
      invitation_codes: {
        Row: {
          code: string
          id: number
          is_used: boolean | null
        }
        Insert: {
          code: string
          id?: number
          is_used?: boolean | null
        }
        Update: {
          code?: string
          id?: number
          is_used?: boolean | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          company_id: string | null
          created_at: string | null
          email: string
          id: number
          invited_by: string | null
          is_used: boolean | null
          token: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          email: string
          id?: number
          invited_by?: string | null
          is_used?: boolean | null
          token: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          email?: string
          id?: number
          invited_by?: string | null
          is_used?: boolean | null
          token?: string
        }
        Relationships: []
      }
      mail_subscribers: {
        Row: {
          email: string | null
        }
        Insert: {
          email?: string | null
        }
        Update: {
          email?: string | null
        }
        Relationships: []
      }
      maintenance: {
        Row: {
          commodity: string | null
          created_at: string | null
          dimensions: string | null
          freight_id: number | null
          id: number
          inventory_number: string | null
          maintenance_crew: string | null
          make: string | null
          model: string | null
          need_parts: boolean | null
          notes: string | null
          pallets: string | null
          part: string | null
          schedule_date: string | null
          serial_number: string | null
          urgency: string | null
          user_id: string | null
          year: string | null
        }
        Insert: {
          commodity?: string | null
          created_at?: string | null
          dimensions?: string | null
          freight_id?: number | null
          id?: number
          inventory_number?: string | null
          maintenance_crew?: string | null
          make?: string | null
          model?: string | null
          need_parts?: boolean | null
          notes?: string | null
          pallets?: string | null
          part?: string | null
          schedule_date?: string | null
          serial_number?: string | null
          urgency?: string | null
          user_id?: string | null
          year?: string | null
        }
        Update: {
          commodity?: string | null
          created_at?: string | null
          dimensions?: string | null
          freight_id?: number | null
          id?: number
          inventory_number?: string | null
          maintenance_crew?: string | null
          make?: string | null
          model?: string | null
          need_parts?: boolean | null
          notes?: string | null
          pallets?: string | null
          part?: string | null
          schedule_date?: string | null
          serial_number?: string | null
          urgency?: string | null
          user_id?: string | null
          year?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null;
          id: number;
          is_read: boolean | null;
          message: string;
          user_id: string | null;
          document_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_read?: boolean | null;
          message: string;
          user_id?: string | null;
          document_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_read?: boolean | null;
          message?: string;
          user_id?: string | null;
          document_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "auth.users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_document_id_fkey";
            columns: ["document_id"];
            referencedRelation: "documents";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          cancellation_reason: string | null
          created_at: string | null
          destination_street: string | null
          earliest_pickup_date: string | null
          id: number
          is_archived: boolean | null
          latest_pickup_date: string | null
          notes: string | null
          origin_street: string | null
          quote_id: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          created_at?: string | null
          destination_street?: string | null
          earliest_pickup_date?: string | null
          id?: number
          is_archived?: boolean | null
          latest_pickup_date?: string | null
          notes?: string | null
          origin_street?: string | null
          quote_id?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          created_at?: string | null
          destination_street?: string | null
          earliest_pickup_date?: string | null
          id?: number
          is_archived?: boolean | null
          latest_pickup_date?: string | null
          notes?: string | null
          origin_street?: string | null
          quote_id?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_shippingquotes"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "shippingquotes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          company_id: string | null
          company_name: string | null
          company_size: string | null
          email: string
          email_notifications: boolean | null
          first_name: string | null
          id: string
          inserted_at: string | null
          last_name: string | null
          phone_number: string | null
          profile_picture: string | null
          role: string
        }
        Insert: {
          address?: string | null
          company_id?: string | null
          company_name?: string | null
          company_size?: string | null
          email: string
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          inserted_at?: string | null
          last_name?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          role: string
        }
        Update: {
          address?: string | null
          company_id?: string | null
          company_name?: string | null
          company_size?: string | null
          email?: string
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          inserted_at?: string | null
          last_name?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          role?: string
        }
        Relationships: []
      }
      purchase_order: {
        Row: {
          createddate: string | null
          expecteddate: string | null
          id: number
          order_description: string | null
          ponumber: string | null
          status: string | null
          user_id: string | null
          vendorname: string | null
          vendornumber: string | null
        }
        Insert: {
          createddate?: string | null
          expecteddate?: string | null
          id?: number
          order_description?: string | null
          ponumber?: string | null
          status?: string | null
          user_id?: string | null
          vendorname?: string | null
          vendornumber?: string | null
        }
        Update: {
          createddate?: string | null
          expecteddate?: string | null
          id?: number
          order_description?: string | null
          ponumber?: string | null
          status?: string | null
          user_id?: string | null
          vendorname?: string | null
          vendornumber?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchase_order_vendors"
            columns: ["vendornumber"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["vendornumber"]
          },
          {
            foreignKeyName: "purchase_order_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shippingquotes: {
        Row: {
          commodity: string | null
          destination_city: string | null
          destination_state: string | null
          destination_street: string | null
          destination_zip: string | null
          due_date: string | null
          email: string | null
          first_name: string | null
          height: string | null
          id: number
          inserted_at: string | null
          is_archived: boolean | null
          is_complete: boolean | null
          last_name: string | null
          length: string | null
          make: string | null
          model: string | null
          origin_city: string | null
          origin_state: string | null
          origin_street: string | null
          origin_zip: string | null
          pallet_count: string | null
          price: number | null
          quote_id: string | null
          user_id: string | null
          weight: string | null
          width: string | null
          year_amount: string | null
        }
        Insert: {
          commodity?: string | null
          destination_city?: string | null
          destination_state?: string | null
          destination_street?: string | null
          destination_zip?: string | null
          due_date?: string | null
          email?: string | null
          first_name?: string | null
          height?: string | null
          id?: number
          inserted_at?: string | null
          is_archived?: boolean | null
          is_complete?: boolean | null
          last_name?: string | null
          length?: string | null
          make?: string | null
          model?: string | null
          origin_city?: string | null
          origin_state?: string | null
          origin_street?: string | null
          origin_zip?: string | null
          pallet_count?: string | null
          price?: number | null
          quote_id?: string | null
          user_id?: string | null
          weight?: string | null
          width?: string | null
          year_amount?: string | null
        }
        Update: {
          commodity?: string | null
          destination_city?: string | null
          destination_state?: string | null
          destination_street?: string | null
          destination_zip?: string | null
          due_date?: string | null
          email?: string | null
          first_name?: string | null
          height?: string | null
          id?: number
          inserted_at?: string | null
          is_archived?: boolean | null
          is_complete?: boolean | null
          last_name?: string | null
          length?: string | null
          make?: string | null
          model?: string | null
          origin_city?: string | null
          origin_state?: string | null
          origin_street?: string | null
          origin_zip?: string | null
          pallet_count?: string | null
          price?: number | null
          quote_id?: string | null
          user_id?: string | null
          weight?: string | null
          width?: string | null
          year_amount?: string | null
        }
        Relationships: []
      }
      usage_stats: {
        Row: {
          active_time: number
          created_at: string | null
          id: number
          login_count: number
          user_id: string | null
        }
        Insert: {
          active_time: number
          created_at?: string | null
          id?: number
          login_count: number
          user_id?: string | null
        }
        Update: {
          active_time?: number
          created_at?: string | null
          id?: number
          login_count?: number
          user_id?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          businesscity: string | null
          businessstate: string | null
          businessstreet: string | null
          email: string | null
          id: number
          phone: string | null
          vendorname: string | null
          vendornumber: string
        }
        Insert: {
          businesscity?: string | null
          businessstate?: string | null
          businessstreet?: string | null
          email?: string | null
          id?: number
          phone?: string | null
          vendorname?: string | null
          vendornumber: string
        }
        Update: {
          businesscity?: string | null
          businessstate?: string | null
          businessstreet?: string | null
          email?: string | null
          id?: number
          phone?: string | null
          vendorname?: string | null
          vendornumber?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_profiles: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never


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
export type ChromeQuotes = Database['public']['Tables']['chrome_quotes']['Row'];
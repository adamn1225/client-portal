export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      freight: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          freight_type: string | null
          make: string | null
          model: string | null
          year: string | null
          pallets: string | null
          serial_number: string | null
          dimensions: string | null
          freight_id: string | null
          freight_class: string | null
          status: string | null
          user_id: string
          due_date: string | null
          in_progress: boolean | null
          reminder_time: string | null
          year_amount: string | null
          pallet_count: string | null
          commodity: string | null
          length: string | null
          length_unit: string | null
          width: string | null
          width_unit?: string | null
          height: string | null
          height_unit?: string | null
          weight: string | null
          weight_unit: string | null
          inventory_number: string | null
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
          due_date?: string | null
          in_progress?: boolean | null
          reminder_time?: string | null
          year_amount?: string | null
          pallet_count?: string | null
          commodity?: string | null
          length?: string | null
          length_unit?: string | null
          width?: string | null
          width_unit?: string | null
          height?: string | null
          height_unit?: string | null
          weight?: string | null
          weight_unit?: string | null
          serial_number?: string | null
          inventory_number?: string | null
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
          due_date?: string | null
          in_progress?: boolean | null
          reminder_time?: string | null
          year_amount?: string | null
          pallet_count?: string | null
          commodity?: string | null
          length?: string | null
          length_unit?: string | null
          width?: string | null
          width_unit?: string | null
          height?: string | null
          height_unit?: string | null
          weight?: string | null
          weight_unit?: string | null
          serial_number?: string | null
          inventory_number?: string | null
        }
      },
      shippingquotes: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          origin_city: string | null
          origin_state: string | null
          origin_zip: string | null
          destination_city: string | null
          destination_state: string | null
          destination_zip: string | null
          user_id: string
          due_date: string | null
          year_amount: string | null
          make: string | null
          model: string | null
          pallet_count: string | null
          commodity: string | null
          length: string | null
          width: string | null
          height: string | null
          weight: string | null
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          origin_city?: string | null
          origin_state?: string | null
          origin_zip?: string | null
          destination_city?: string | null
          destination_state?: string | null
          destination_zip?: string | null
          user_id: string
          due_date?: string | null
          year_amount?: string | null
          make?: string | null
          model?: string | null
          pallet_count?: string | null
          commodity?: string | null
          length?: string | null
          width?: string | null
          height?: string | null
          weight?: string | null
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          origin_city?: string | null
          origin_state?: string | null
          origin_zip?: string | null
          destination_city?: string | null
          destination_state?: string | null
          destination_zip?: string | null
          user_id?: string
          due_date?: string | null
          year_amount?: string | null
          make?: string | null
          model?: string | null
          pallet_count?: string | null
          commodity?: string | null
          length?: string | null
          width?: string | null
          height?: string | null
          weight?: string | null
        }
      },
      profiles: {
        Row: {
          id: string // Ensure this is a UUID
          email: string // Add email field
          role: string // Add this line
          inserted_at: string // Ensure this is consistent with other tables
          first_name: string | null
          last_name: string | null
          company_name: string | null
          profile_picture: string | null
          address: string | null
          phone_number: string | null // Add phone_number field
        }
        Insert: {
          id: string // Ensure this is a UUID
          email: string // Add email field
          role: string // Add this line
          inserted_at?: string
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          profile_picture?: string | null
          address?: string | null
          phone_number?: string | null // Add phone_number field
        }
        Update: {
          id?: string // Ensure this is a UUID
          email?: string // Add email field
          role?: string // Add this line
          inserted_at?: string
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          profile_picture?: string | null
          address?: string | null
          phone_number?: string | null // Add phone_number field
        }
      }
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
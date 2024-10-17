// lib/schema.ts
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
          width: string | null
          height: string | null
          weight: string | null
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
          width?: string | null
          height?: string | null
          weight?: string | null
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
          width?: string | null
          height?: string | null
          weight?: string | null
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
        }
      },
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          updated_at?: string
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
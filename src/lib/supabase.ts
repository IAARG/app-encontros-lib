import { createClient } from '@supabase/supabase-js'

// Configuração com fallback para desenvolvimento local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Função para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey &&
         supabaseUrl.includes('supabase.co')
}

// Cliente Supabase condicional
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    })
  : null

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          age: number
          bio: string
          interests: string[]
          location: string
          photos: string[]
          preferences: {
            ageRange: [number, number]
            maxDistance: number
            interests: string[]
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          age: number
          bio?: string
          interests?: string[]
          location?: string
          photos?: string[]
          preferences?: {
            ageRange: [number, number]
            maxDistance: number
            interests: string[]
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          age?: number
          bio?: string
          interests?: string[]
          location?: string
          photos?: string[]
          preferences?: {
            ageRange: [number, number]
            maxDistance: number
            interests: string[]
          }
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          status: 'pending' | 'matched' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          status?: 'pending' | 'matched' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          status?: 'pending' | 'matched' | 'rejected'
        }
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          location: string
          max_participants: number
          current_participants: number
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          location: string
          max_participants?: number
          current_participants?: number
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          location?: string
          max_participants?: number
          current_participants?: number
          created_by?: string
        }
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
        }
      }
    }
  }
}
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          role: string
          department: string | null
          position: string | null
          hire_date: string | null
          employee_id: string | null
          contact_email: string | null
          phone: string | null
          emergency_contact: string | null
          is_active: boolean
          last_login: string | null
        }
        Insert: {
          id: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          department?: string | null
          position?: string | null
          hire_date?: string | null
          employee_id?: string | null
          contact_email?: string | null
          phone?: string | null
          emergency_contact?: string | null
          is_active?: boolean
          last_login?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          department?: string | null
          position?: string | null
          hire_date?: string | null
          employee_id?: string | null
          contact_email?: string | null
          phone?: string | null
          emergency_contact?: string | null
          is_active?: boolean
          last_login?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          status: string
          priority: string
          due_date: string | null
          category: string | null
          created_by: string | null
          assigned_to: string | null
          parent_task_id: string | null
          is_recurring: boolean
          recurrence_pattern: string | null
          estimated_hours: number | null
          actual_hours: number | null
          completion_date: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          category?: string | null
          created_by?: string | null
          assigned_to?: string | null
          parent_task_id?: string | null
          is_recurring?: boolean
          recurrence_pattern?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          completion_date?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          category?: string | null
          created_by?: string | null
          assigned_to?: string | null
          parent_task_id?: string | null
          is_recurring?: boolean
          recurrence_pattern?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          completion_date?: string | null
          tags?: string[] | null
        }
      }
      // ... Additional table types will be added here
    }
  }
}
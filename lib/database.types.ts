export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      palette_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["paletteactivitytype"]
          created_at: string
          id: number
          palette_id: number
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["paletteactivitytype"]
          created_at?: string
          id?: number
          palette_id: number
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["paletteactivitytype"]
          created_at?: string
          id?: number
          palette_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "palette_activities_palette_id_fkey"
            columns: ["palette_id"]
            isOneToOne: false
            referencedRelation: "palettes"
            referencedColumns: ["id"]
          },
        ]
      }
      palette_colors: {
        Row: {
          color_families: Json | null
          created_at: string
          hex: string | null
          id: number
          name: string | null
          palette_id: number
          position: number | null
          role: Database["public"]["Enums"]["colorrole"] | null
          updated_at: string
        }
        Insert: {
          color_families?: Json | null
          created_at?: string
          hex?: string | null
          id?: number
          name?: string | null
          palette_id: number
          position?: number | null
          role?: Database["public"]["Enums"]["colorrole"] | null
          updated_at?: string
        }
        Update: {
          color_families?: Json | null
          created_at?: string
          hex?: string | null
          id?: number
          name?: string | null
          palette_id?: number
          position?: number | null
          role?: Database["public"]["Enums"]["colorrole"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "palette_colors_palette_id_fkey"
            columns: ["palette_id"]
            isOneToOne: false
            referencedRelation: "palettes"
            referencedColumns: ["id"]
          },
        ]
      }
      palette_identities: {
        Row: {
          author: string | null
          best_for: string | null
          id: number
          long_description: string | null
          name: string
          palette_id: number
          short_description: string | null
          slug: string
          story: string | null
          tagline: string | null
        }
        Insert: {
          author?: string | null
          best_for?: string | null
          id?: number
          long_description?: string | null
          name: string
          palette_id: number
          short_description?: string | null
          slug: string
          story?: string | null
          tagline?: string | null
        }
        Update: {
          author?: string | null
          best_for?: string | null
          id?: number
          long_description?: string | null
          name?: string
          palette_id?: number
          short_description?: string | null
          slug?: string
          story?: string | null
          tagline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "palette_identities_palette_id_fkey"
            columns: ["palette_id"]
            isOneToOne: true
            referencedRelation: "palettes"
            referencedColumns: ["id"]
          },
        ]
      }
      palette_stats: {
        Row: {
          downloads: number | null
          favorites: number | null
          id: number
          palette_id: number
          saves: number | null
        }
        Insert: {
          downloads?: number | null
          favorites?: number | null
          id?: number
          palette_id: number
          saves?: number | null
        }
        Update: {
          downloads?: number | null
          favorites?: number | null
          id?: number
          palette_id?: number
          saves?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "palette_stats_palette_id_fkey"
            columns: ["palette_id"]
            isOneToOne: true
            referencedRelation: "palettes"
            referencedColumns: ["id"]
          },
        ]
      }
      palettes: {
        Row: {
          created_at: string
          created_by: string | null
          creation_method:
            | Database["public"]["Enums"]["palettecreatedby"]
            | null
          filters: Json | null
          id: number
          inspiration_sources: string | null
          is_free: boolean | null
          status: Database["public"]["Enums"]["palettestatus"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          creation_method?:
            | Database["public"]["Enums"]["palettecreatedby"]
            | null
          filters?: Json | null
          id?: number
          inspiration_sources?: string | null
          is_free?: boolean | null
          status?: Database["public"]["Enums"]["palettestatus"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          creation_method?:
            | Database["public"]["Enums"]["palettecreatedby"]
            | null
          filters?: Json | null
          id?: number
          inspiration_sources?: string | null
          is_free?: boolean | null
          status?: Database["public"]["Enums"]["palettestatus"] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_filtered_palettes: {
        Args: {
          p_filters?: Json
          p_page?: number
          p_page_size?: number
          p_search?: string
          p_sort_by?: string
        }
        Returns: {
          palette_id: number
          total_count: number
        }[]
      }
    }
    Enums: {
      colorrole:
        | "primary"
        | "secondary"
        | "accent"
        | "background"
        | "surface"
        | "neutral"
        | "text"
        | "muted"
        | "border"
        | "success"
        | "warning"
        | "error"
        | "info"
      paletteactivitytype: "save" | "favorite" | "download"
      palettecreatedby: "manual" | "generated" | "ai-assisted"
      palettestatus: "published" | "draft"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      colorrole: [
        "primary",
        "secondary",
        "accent",
        "background",
        "surface",
        "neutral",
        "text",
        "muted",
        "border",
        "success",
        "warning",
        "error",
        "info",
      ],
      paletteactivitytype: ["save", "favorite", "download"],
      palettecreatedby: ["manual", "generated", "ai-assisted"],
      palettestatus: ["published", "draft"],
    },
  },
} as const

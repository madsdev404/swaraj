// src/types/supabase.ts

export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  image_url?: string;
  lat?: number;
  lng?: number;
  created_at: string;
  // Add any joined fields if you plan to select them (e.g., user_name, tags_array)
  user_name?: string;
  user_avatar_url?: string;
  tags?: Tag[]; // Array of Tag objects
}
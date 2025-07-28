import { supabase } from '@/utils/supabase';

import { Tag } from '../../types/supabase';

interface TagResult {
  data: Tag[] | null;
  error: Error | null;
}

interface FollowTagResult {
  error: Error | null;
}

export async function fetchAllTags(): Promise<TagResult> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*');

    if (error) {
      return { data: null, error: new Error(error.message) };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function followTag(userId: string, tagId: string): Promise<FollowTagResult> {
  try {
    const { error } = await supabase
      .from('user_follows_tags')
      .insert({ user_id: userId, tag_id: tagId });

    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function unfollowTag(userId: string, tagId: string): Promise<FollowTagResult> {
  try {
    const { error } = await supabase
      .from('user_follows_tags')
      .delete()
      .match({ user_id: userId, tag_id: tagId });

    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}
import { supabase } from '@/utils/supabase';

import { Post, Tag } from '../../types/supabase';

interface PostResult {
  data: Post | null;
  error: Error | null;
}

interface PostsResult {
  data: Post[] | null;
  error: Error | null;
}

interface UpvoteSaveResult {
  error: Error | null;
}

export async function createPost(postData: {
  title: string;
  description?: string;
  image_url?: string;
  lat?: number;
  lng?: number;
  userId: string;
  tags?: string[]; // Array of tag names
}): Promise<PostResult> {
  try {
    const { title, description, image_url, lat, lng, userId, tags } = postData;

    // Insert the post
    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        title,
        description,
        image_url,
        lat,
        lng,
      })
      .select('*')
      .single();

    if (postError) {
      return { data: null, error: new Error(postError.message) };
    }

    // If tags are provided, link them to the post
    if (tags && tags.length > 0) {
      // Fetch existing tag IDs
      const { data: existingTags, error: tagsFetchError } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', tags);

      if (tagsFetchError) {
        // Log error but don't fail post creation if tags linking fails
        console.error('Error fetching existing tags for post:', tagsFetchError.message);
      }

      const tagIdsToLink: string[] = [];
      const newTagNames: string[] = [];

      // Separate existing and new tags
      const existingTagNames = new Set(existingTags?.map(t => t.name));
      for (const tagName of tags) {
        if (existingTagNames.has(tagName)) {
          tagIdsToLink.push(existingTags?.find(t => t.name === tagName)?.id as string);
        } else {
          newTagNames.push(tagName);
        }
      }

      // Create new tags if any
      if (newTagNames.length > 0) {
        const { data: createdTags, error: createTagsError } = await supabase
          .from('tags')
          .insert(newTagNames.map(name => ({ name })))
          .select('id');
        if (createTagsError) {
          console.error('Error creating new tags for post:', createTagsError.message);
        } else {
          tagIdsToLink.push(...createdTags.map(t => t.id));
        }
      }

      // Insert into post_tags junction table
      if (tagIdsToLink.length > 0) {
        const postTagsToInsert = tagIdsToLink.map(tag_id => ({
          post_id: newPost.id,
          tag_id,
        }));
        const { error: postTagsError } = await supabase
          .from('post_tags')
          .insert(postTagsToInsert);
        if (postTagsError) {
          console.error('Error linking tags to post:', postTagsError.message);
        }
      }
    }

    return { data: newPost, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function fetchGlobalFeed(): Promise<PostsResult> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (name, avatar_url),
        post_tags (
          tags (id, name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Flatten the data structure for easier consumption
    const formattedData = data.map(post => ({
      ...post,
      user_name: post.users?.name,
      user_avatar_url: post.users?.avatar_url,
      tags: post.post_tags.map((pt: any) => pt.tags), // Assuming pt.tags is the actual tag object
    }));

    return { data: formattedData as Post[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function fetchPersonalizedFeed(userId: string): Promise<PostsResult> {
  try {
    // First, get the tags the user follows
    const { data: followedTags, error: followedTagsError } = await supabase
      .from('user_follows_tags')
      .select('tag_id')
      .eq('user_id', userId);

    if (followedTagsError) {
      return { data: null, error: new Error(followedTagsError.message) };
    }

    const tagIds = followedTags.map(ft => ft.tag_id);

    if (tagIds.length === 0) {
      return { data: [], error: null }; // User follows no tags, return empty feed
    }

    // Then, fetch posts that have any of these tags
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (name, avatar_url),
        post_tags (
          tags (id, name)
        )
      `)
      .in('post_tags.tag_id', tagIds) // Filter posts by tags the user follows
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    // Flatten the data structure
    const formattedData = data.map(post => ({
      ...post,
      user_name: post.users?.name,
      user_avatar_url: post.users?.avatar_url,
      tags: post.post_tags.map((pt: any) => pt.tags),
    }));

    return { data: formattedData as Post[], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function upvotePost(userId: string, postId: string): Promise<UpvoteSaveResult> {
  try {
    const { error } = await supabase
      .from('upvotes')
      .insert({ user_id: userId, post_id: postId });

    if (error) {
      // Handle unique constraint error if user already upvoted
      if (error.code === '23505') { // Unique violation
        return { error: new Error('You have already upvoted this post.') };
      }
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function savePost(userId: string, postId: string): Promise<UpvoteSaveResult> {
  try {
    const { error } = await supabase
      .from('saved_posts')
      .insert({ user_id: userId, post_id: postId });

    if (error) {
      // Handle unique constraint error if user already saved
      if (error.code === '23505') { // Unique violation
        return { error: new Error('You have already saved this post.') };
      }
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Gemini-Fix-20250728-1: Confirmed syntax fix for savePost return statement. This line confirms the file was updated by Gemini.

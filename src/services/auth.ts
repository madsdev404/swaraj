import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthResult {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

interface UserResult {
  user: User | null;
  error: Error | null;
}

interface SignOutResult {
  error: Error | null;
}

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      return { user: null, session: null, error: new Error(error.message) };
    }

    // For OAuth, data.user and data.session might be null initially as the redirect handles it.
    // We might need to listen to auth state changes or rely on the redirect.
    // For now, we'll return what Supabase gives us.
    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    return { user: null, session: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function signOut(): Promise<SignOutResult> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

export async function getCurrentUser(): Promise<UserResult> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      return { user: null, error: new Error(sessionError.message) };
    }

    if (!session) {
      return { user: null, error: null }; // No active session
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return { user: null, error: new Error(userError.message) };
    }

    return { user, error: null };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
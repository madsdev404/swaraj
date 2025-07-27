import { useState, useEffect } from 'react';
import { signInWithGoogle, signOut, getCurrentUser } from '../services/auth';
import { supabase } from '../lib/supabase'; // Import the supabase client
import { router } from 'expo-router'; // Import router for navigation

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { user: currentUser, error: userError } = await getCurrentUser();
      if (userError) {
        setError(userError.message);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null);
          router.replace('/home'); // Navigate to home tabs after sign-in
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.replace('/login'); // Navigate back to login after sign-out
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error: authError } = await signInWithGoogle();
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
    // Supabase handles the redirect for OAuth, so no further action here for success
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    const { error: signOutError } = await signOut();
    if (signOutError) {
      setError(signOutError.message);
    }
    setLoading(false);
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
  };
}
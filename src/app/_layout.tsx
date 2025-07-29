import { Stack, useRouter, SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import "./global.css";
import { supabase } from "@/utils/supabase";
import { QueryProvider } from "@/providers/QueryProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login'); // Explicitly go to login
      }
      SplashScreen.hideAsync();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login'); // Explicitly go to login
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <QueryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </QueryProvider>
  );
}
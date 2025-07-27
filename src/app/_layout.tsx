import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; // Import your useAuth hook

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, loading } = useAuth(); // Use your auth hook

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return null; // Or a custom loading component
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Add other routes here if needed */}
    </Stack>
  );
}
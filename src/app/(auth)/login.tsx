import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { supabase } from "@/utils/supabase";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const redirectUri = AuthSession.makeRedirectUri({});

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUri,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
      return;
    }

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
      );

      if (result.type === "success" && result.url) {
        const urlParts = result.url.split("#");
        if (urlParts.length > 1) {
          const urlParams = new URLSearchParams(urlParts[1]);
          const accessToken = urlParams.get("access_token");
          const refreshToken = urlParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (sessionError) {
              console.error(
                "Error setting session after OAuth:",
                sessionError.message
              );
            } else if (sessionData.session) {
              console.log(
                "Session successfully set in login.tsx:"
                // sessionData.session
              );
            }
          }
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

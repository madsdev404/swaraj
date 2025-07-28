import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";
import { View, Text, ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processUrl = async (url: string | null) => {
      if (!url) {
        setProcessing(false);
        return;
      }
      let actualUrl = url;
      if (url.startsWith("exp://") && url.includes("url=")) {
        const queryParams = new URLSearchParams(url.split("?")[1]);
        const innerUrl = queryParams.get("url");
        if (innerUrl) {
          actualUrl = decodeURIComponent(innerUrl);
        }
      }

      try {
        const urlParts = actualUrl.split("#");
        if (urlParts.length < 2) {
          router.replace("/login");
          return;
        }
        const urlParams = new URLSearchParams(urlParts[1]);
        const accessToken = urlParams.get("access_token");
        const refreshToken = urlParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            router.replace("/login"); // Redirect to login on error
          } else if (data.session) {
            router.replace("/(tabs)");
          } else {
            router.replace("/login");
          }
        } else {
          router.replace("/login");
        }
      } catch (e) {
        router.replace("/login");
        console.log(e);
      }
      setProcessing(false);
    };

    Linking.getInitialURL().then(processUrl);

    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      processUrl(url);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/(tabs)");
      } else if (_event === "SIGNED_OUT") {
        router.replace("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, [router]);

  if (processing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Processing authentication...</Text>
      </View>
    );
  }

  return null; // Or a fallback UI if not processing
}

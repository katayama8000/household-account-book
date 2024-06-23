import { supabase } from "@/lib/supabase";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { push } = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("user", data);
      if (error || !data) {
        push({ pathname: "/sign-in" });
        return;
      }

      if (!data.user) {
        return;
      }

      supabase.auth.onAuthStateChange((event, _session) => {
        switch (event) {
          case "SIGNED_IN":
            push({ pathname: "/" });
            break;
          case "SIGNED_OUT":
            push({ pathname: "/sign-in" });
            break;
        }
      });
    })();
  }, [push]);

  if (!loaded) {
    return <Slot />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modal)/payment-modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

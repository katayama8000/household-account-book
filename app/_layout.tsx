import { supabase } from "@/lib/supabase";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useCouple } from "./hooks/useCouple";
import { useAtom } from "jotai";
import { coupleIdAtom } from "./state/couple.state";
import { activeInvoiceAtom } from "./state/invoice.state";
import { useInvoice } from "./hooks/useInvoice";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const { push } = useRouter();
  const { fetchCoupleIdByUserId } = useCouple();
  const [_coupleId, setCoupleId] = useAtom(coupleIdAtom);
  const { fetchActiveInvoiceByCoupleId } = useInvoice();
  const [_activeInvoice, setActiveInvoice] = useAtom(activeInvoiceAtom);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const authState = () => {
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
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("user", data);
      if (error || !data) {
        // error defore mounting the root layout
        push({ pathname: "/sign-in" });
      }

      if (!data.user) {
        return;
      }

      const coupleId = await fetchCoupleIdByUserId(data.user?.id);
      if (!coupleId) {
        throw new Error("coupleId is not found");
      }
      setCoupleId(coupleId);

      const activeInvoice = await fetchActiveInvoiceByCoupleId(coupleId);
      setActiveInvoice(activeInvoice);

      setIsCheckingAuth(false);
    };

    checkAuth();
    authState();
  }, [push, setIsCheckingAuth]);

  if (!loaded || isCheckingAuth) {
    return null;
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

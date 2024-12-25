import { supabase } from "@/lib/supabase";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import "react-native-reanimated";
import { usePushNotification } from "@/hooks/usePushNotification";
import { useUser } from "@/hooks/useUser";
import { userAtom } from "@/state/user.state";
import {
  type EventSubscription,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  setNotificationHandler,
} from "expo-notifications";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as LocalAuthentication from "expo-local-authentication";

preventAutoHideAsync();

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const { fetchUser, updateExpoPushToken } = useUser();
  const [_, setUser] = useAtom(userAtom);
  const { registerForPushNotificationsAsync } = usePushNotification();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { push } = useRouter();

  useEffect(() => {
    if (loaded) hideAsync();
  }, [loaded]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("user", data);
      if (error || !data || !data.user) {
        push({ pathname: "/sign-in" });
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

  const notificationListener = useRef<EventSubscription>();
  const responseListener = useRef<EventSubscription>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();

      const uid = (await supabase.auth.getSession())?.data.session?.user?.id;
      if (!uid) {
        push({ pathname: "/sign-in" });
        return;
      }
      const user = await fetchUser(uid);
      if (!user) {
        push({ pathname: "/sign-in" });
        return;
      }

      setUser(user);

      if (token) updateExpoPushToken(uid, token);

      // notificationListener.current = addNotificationReceivedListener((notification) => {
      //   setNotification(notification);
      // });

      responseListener.current = addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

      return () => {
        notificationListener.current && removeNotificationSubscription(notificationListener.current);
        responseListener.current && removeNotificationSubscription(responseListener.current);
      };
    })();
  }, []);

  if (!loaded) return <Slot />;

  LocalAuthentication.authenticateAsync({
    promptMessage: "認証してください",
  });

  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(modal)/payment-modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

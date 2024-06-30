import { supabase } from "@/lib/supabase";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { Button, Platform, Text, View } from "react-native";
import {
  AndroidImportance,
  addNotificationReceivedListener,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  type Subscription,
  type Notification,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  setNotificationHandler,
} from "expo-notifications";
import { isDevice } from "expo-device";

SplashScreen.preventAutoHideAsync();

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// 直接apiを叩いているが、expo-notification-clientを使い、apiを新設する
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

const handleRegistrationError = (errorMessage: string) => {
  alert(errorMessage);
  throw new Error(errorMessage);
};

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    setNotificationChannelAsync("default", {
      name: "default",
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (isDevice) {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError("Permission not granted to get push token for push notification!");
      return;
    }
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
};

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

  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<Notification | undefined>(undefined);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current = addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      notificationListener.current && removeNotificationSubscription(notificationListener.current);
      responseListener.current && removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!loaded) {
    return <Slot />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
        <Text>Title: {notification && notification.request.content.title} </Text>
        {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modal)/payment-modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

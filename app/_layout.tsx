import "@/app/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname, useGlobalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/token-cache";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "@/src/config/posthog";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment");
}

function SessionWatcher() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      posthog.identify(user.id, {
        $set: {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
        },
      });
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    regular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    bold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    extrabold: require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    light: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    medium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    semibold: require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
          propsToCapture: ["testID"],
          maxElementsCaptured: 20,
        }}
      >
        <SessionWatcher />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </PostHogProvider>
    </ClerkProvider>
  );
}

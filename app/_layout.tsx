import "@/app/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/token-cache";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    regular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    bold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    extrabold: require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    light: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    medium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    semibold: require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}

import { useAuth } from "@clerk/clerk-expo";
import { Stack, router } from "expo-router";
import React, { useEffect } from "react";

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

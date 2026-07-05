import { Link } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  console.log("at Index");
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-bold text-gray-900">
        Welcome to NativeWind
      </Text>
      <Text className="mt-2 text-base text-gray-500">
        Edit app/index.tsx to{" "}
        <Text className="text-blue-500">get started</Text>
      </Text>

      <Link href={"/onboarding"} className="mt-4 rounded bg-slate-500 text-black">Onboarding</Link>
      <Link href={"/(auth)/sign-in"} className="mt-4 rounded bg-slate-500 text-black">SignIn</Link>
      <Link href={"/(tabs)/insights"} className="mt-4 rounded bg-slate-500 text-black">Insights</Link>
      <Link href={"/(tabs)/subscriptions"} className="mt-4 rounded bg-slate-500 text-black">subscriptions</Link>
      <Link href={"/(tabs)/settings"} className="mt-4 rounded bg-slate-500 text-black">settings</Link>
    </SafeAreaView>
  );
}

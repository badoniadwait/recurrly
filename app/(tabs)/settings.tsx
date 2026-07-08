import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { signOut } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary">Settings</Text>

      <View className="mt-8 rounded-3xl border border-border bg-card p-5">
        <View className="items-center">
          <View className="mb-4 size-20 items-center justify-center rounded-full bg-accent">
            <Text className="text-3xl font-sans-bold text-white">
              {(user.fullName || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <Text className="text-xl font-sans-bold text-primary">{user.fullName || "User"}</Text>
          <Text className="mt-1 text-base font-sans-medium text-muted-foreground">
            {user.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
      </View>

      <View className="mt-auto pb-5">
        <TouchableOpacity className="items-center rounded-2xl bg-destructive py-4" onPress={() => signOut()}>
          <Text className="text-base font-sans-bold text-white">Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View className="pb-11"/>
    </SafeAreaView>
  );
}

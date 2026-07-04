
import "@/app/global.css";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
    return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>

      // <Tabs screenOptions={{headerShown: false}}>
      //       <Tabs.Screen name="(tabs)"></Tabs.Screen>
      // </Tabs>
        // <Stack screenOptions={{headerShown: false}}/>
    )
}



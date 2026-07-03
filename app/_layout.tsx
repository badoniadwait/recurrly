import { Stack } from "expo-router";

import "@/app/global.css";
import React from "react";

export default function RootLayout() {
    return (
    // <Stack>
    //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    // </Stack>
        <Stack screenOptions={{headerShown: false}}/>
    )
}



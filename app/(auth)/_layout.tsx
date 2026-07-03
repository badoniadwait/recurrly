import { Stack } from "expo-router";

import "@/app/global.css";
import React from "react";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}/>
    )
}
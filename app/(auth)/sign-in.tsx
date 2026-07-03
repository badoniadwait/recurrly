import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function SignIn() {

    return (
        <View className="flex-1 items-center justify-center bg-white p-5">
            <Text>
                SignIn
            </Text>
            <Link href={"/(auth)/sign-up"} className="mt-4 rounded bg-slate-500 text-black">create account</Link>
        </View>
    )
    
}
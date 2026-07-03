import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function SignUp() {

    return (
        <View className="flex-1 items-center justify-center bg-white p-5">
            <Text>
                SignUp
            </Text>
            <Link href={"/(auth)/sign-in"} className="mt-4 rounded bg-slate-500 text-black"> login </Link>
            
        </View>
    )
    
}
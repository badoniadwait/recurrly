import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function SubscriptionDetails() {

    const {id} = useLocalSearchParams<{id:string}>();

    return (
        <View className="flex-1 items-center justify-center bg-white p-5">
            <Text>
                SubscriptionsDetails: {id}
            </Text>
            <Link href={"/index"}> go back</Link>
        </View>
    )
    
}
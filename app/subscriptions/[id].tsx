import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubscriptionDetails() {

    const {id} = useLocalSearchParams<{id:string}>();

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text>
                SubscriptionsDetails: {id}
            </Text>
            <Link href={"/index"}> go back</Link>
        </SafeAreaView>
    )
    
}
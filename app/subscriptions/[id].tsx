import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

export default function SubscriptionDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const posthog = usePostHog();

    useEffect(() => {
        posthog.capture("subscription_details_viewed", { subscription_id: id });
    }, [id]);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text>
                SubscriptionsDetails: {id}
            </Text>
            <Link href={"/(tabs)"}> go back</Link>
        </SafeAreaView>
    );
}
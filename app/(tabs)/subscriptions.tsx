import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { usePostHog } from "posthog-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Subscriptions() {
    const [search, setSearch] = useState("");
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const posthog = usePostHog();

    const filteredSubscriptions = useMemo(() => {
        if (!search.trim()) return HOME_SUBSCRIPTIONS;
        const q = search.toLowerCase().trim();
        return HOME_SUBSCRIPTIONS.filter(
            (sub) =>
                sub.name.toLowerCase().includes(q) ||
                sub.category?.toLowerCase().includes(q) ||
                sub.plan?.toLowerCase().includes(q)
        );
    }, [search]);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
            <FlatList
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={() => (
                    <View>
                        <Text className="mb-1 text-3xl font-sans-bold text-primary">
                            Subscriptions
                        </Text>
                        <Text className="mb-5 text-base font-sans-medium text-muted-foreground">
                            Manage your subscriptions
                        </Text>
                        <View className="mb-4 flex-row items-center rounded-2xl border border-border bg-card px-4">
                            <TextInput
                                className="flex-1 py-4 text-base font-sans-medium text-primary"
                                placeholder="Search subscriptions..."
                                placeholderTextColor="rgba(0,0,0,0.4)"
                                value={search}
                                onChangeText={setSearch}
                                clearButtonMode="while-editing"
                            />
                        </View>
                    </View>
                )}
                data={filteredSubscriptions}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => {
                            const isExpanding = expandedSubscriptionId !== item.id;
                            setExpandedSubscriptionId((currentId) =>
                                currentId === item.id ? null : item.id
                            );
                            if (isExpanding) {
                                posthog.capture("subscription_card_expanded", {
                                    subscription_id: item.id,
                                    subscription_name: item.name,
                                });
                            }
                        }}
                    />
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text className="py-4 text-sm font-sans-medium text-black/60">
                        {search
                            ? "No subscriptions match your search."
                            : "No Subscriptions yet."}
                    </Text>
                }
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                contentContainerClassName="pb-30"
            />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

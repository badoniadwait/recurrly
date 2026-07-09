import { useSubscriptions } from "@/lib/subscriptions-context";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const getMonthlyValue = (subscription: Subscription) => {
    return subscription.billing === "Yearly"
        ? subscription.price / 12
        : subscription.price;
};

const isActiveSubscription = (subscription: Subscription) => {
    return subscription.status === "active";
};

export default function Insights() {
    const { subscriptions } = useSubscriptions();

    const insights = useMemo(() => {
        const now = dayjs();
        const previousMonthEnd = now.subtract(1, "month").endOf("month");
        const activeSubscriptions = subscriptions.filter(isActiveSubscription);

        const currentMonthlyExpense = activeSubscriptions.reduce(
            (total, subscription) => total + getMonthlyValue(subscription),
            0
        );

        const previousMonthlyExpense = activeSubscriptions
            .filter((subscription) => {
                const startDate = dayjs(subscription.startDate);
                return !startDate.isValid() || startDate.isBefore(previousMonthEnd);
            })
            .reduce((total, subscription) => total + getMonthlyValue(subscription), 0);

        const changePercent =
            previousMonthlyExpense > 0
                ? ((currentMonthlyExpense - previousMonthlyExpense) /
                      previousMonthlyExpense) *
                  100
                : currentMonthlyExpense > 0
                  ? 100
                  : 0;

        const weeklySpend = WEEK_DAYS.map((day) => ({ day, value: 0 }));

        activeSubscriptions.forEach((subscription) => {
            const renewalDate = dayjs(subscription.renewalDate);
            const dayIndex = renewalDate.isValid() ? (renewalDate.day() + 6) % 7 : 0;
            weeklySpend[dayIndex].value += getMonthlyValue(subscription);
        });

        const maxWeeklySpend = Math.max(...weeklySpend.map((item) => item.value), 1);
        const chartTopValue = Math.max(5, Math.ceil(maxWeeklySpend / 5) * 5);
        const yAxisLabels = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
            Math.round(chartTopValue * ratio)
        );
        const featuredBarIndex = weeklySpend.reduce(
            (bestIndex, item, index) =>
                item.value > weeklySpend[bestIndex].value ? index : bestIndex,
            0
        );

        const history = [...subscriptions]
            .filter((subscription) => {
                const renewalDate = dayjs(subscription.renewalDate);
                return (
                    subscription.status !== "active" ||
                    (renewalDate.isValid() && renewalDate.isBefore(now))
                );
            })
            .sort((a, b) => dayjs(b.renewalDate).valueOf() - dayjs(a.renewalDate).valueOf());

        return {
            currentMonthlyExpense,
            changePercent,
            weeklySpend,
            chartTopValue,
            featuredBarIndex,
            history,
            monthLabel: now.format("MMMM YYYY"),
            yAxisLabels,
        };
    }, [subscriptions]);

    const changePrefix = insights.changePercent >= 0 ? "+" : "";

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="px-5 pb-20 pt-4"
            >
                <Text className="mb-8 text-center text-2xl font-sans-bold text-primary">
                    Monthly Insights
                </Text>

                <Text className="mb-5 text-2xl font-sans-bold text-primary">
                    Upcoming
                </Text>

                <View className="mb-5 rounded-3xl bg-muted p-5">
                    <View className="h-48 justify-between">
                        {insights.yAxisLabels.map((label) => (
                            <View key={label} className="flex-row items-center">
                                <Text className="w-8 text-xs font-sans-semibold text-muted-foreground">
                                    {label}
                                </Text>
                                <View className="h-px flex-1 border-t border-dashed border-black/10" />
                            </View>
                        ))}
                    </View>

                    <View className="absolute bottom-11 left-14 right-5 top-12 flex-row items-end justify-between">
                        {insights.weeklySpend.map((item, index) => {
                            const isFeatured = index === insights.featuredBarIndex;
                            const height = Math.max(
                                12,
                                (item.value / insights.chartTopValue) * 160
                            );

                            return (
                                <View key={item.day} className="items-center">
                                    {isFeatured ? (
                                        <View className="-mb-1 rounded-xl bg-background px-3 py-2">
                                            <Text className="text-xs font-sans-bold text-accent">
                                                {formatCurrency(item.value)}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <View
                                        className={clsx(
                                            "w-3 rounded-full",
                                            isFeatured ? "bg-accent" : "bg-primary"
                                        )}
                                        style={{ height }}
                                    />
                                </View>
                            );
                        })}
                    </View>

                    <View className="mt-4 flex-row pl-10">
                        {insights.weeklySpend.map((item) => (
                            <Text
                                key={item.day}
                                className="flex-1 text-center text-xs font-sans-semibold text-muted-foreground"
                            >
                                {item.day}
                            </Text>
                        ))}
                    </View>
                </View>

                <View className="mb-10 rounded-2xl border border-border bg-background p-4">
                    <View className="flex-row items-start justify-between">
                        <View>
                            <Text className="text-xl font-sans-bold text-primary">
                                Expenses
                            </Text>
                            <Text className="mt-2 text-sm font-sans-semibold text-muted-foreground">
                                {insights.monthLabel}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-xl font-sans-bold text-primary">
                                {formatCurrency(insights.currentMonthlyExpense)}
                            </Text>
                            <Text
                                className={clsx(
                                    "mt-2 text-sm font-sans-semibold",
                                    insights.changePercent >= 0
                                        ? "text-primary"
                                        : "text-destructive"
                                )}
                            >
                                {changePrefix}
                                {insights.changePercent.toFixed(0)}%
                            </Text>
                        </View>
                    </View>
                </View>

                <Text className="mb-5 text-2xl font-sans-bold text-primary">
                    History
                </Text>

                <View className="gap-4">
                    {insights.history.length ? (
                        insights.history.map((subscription) => (
                            <View
                                key={subscription.id}
                                className="flex-row items-center rounded-2xl p-4"
                                style={{ backgroundColor: subscription.color || "#f6eecf" }}
                            >
                                <Image
                                    source={subscription.icon}
                                    className="size-14 rounded-xl"
                                    resizeMode="contain"
                                />
                                <View className="ml-4 min-w-0 flex-1">
                                    <Text
                                        className="text-lg font-sans-bold text-primary"
                                        numberOfLines={1}
                                    >
                                        {subscription.name}
                                    </Text>
                                    <Text
                                        className="mt-1 text-sm font-sans-semibold text-muted-foreground"
                                        numberOfLines={1}
                                    >
                                        {dayjs(subscription.renewalDate).isValid()
                                            ? dayjs(subscription.renewalDate).format(
                                                  "MMMM D, HH:mm"
                                              )
                                            : "Renewal date unavailable"}
                                    </Text>
                                </View>
                                <View className="ml-3 items-end">
                                    <Text className="text-lg font-sans-bold text-primary">
                                        {formatCurrency(subscription.price)}
                                    </Text>
                                    <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                                        {subscription.billing === "Yearly"
                                            ? "per year"
                                            : "per month"}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text className="py-4 text-sm font-sans-medium text-muted-foreground">
                            No subscription history yet.
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

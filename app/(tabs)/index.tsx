import { useUser } from "@clerk/clerk-expo";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionsCard from "@/components/UpcomingSubscriptionsCard";
import dayjs from "dayjs";

export default function Index() {
  const { user } = useUser();
  const posthog = usePostHog();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  console.log("at Index");
  return (
    <SafeAreaView className="flex-1 bg-background p-5">

          <FlatList
        ListHeaderComponent={
          () => (
            <>
              <View className="home-header">
                <View className="home-user">
                  <View className="home-avatar items-center justify-center bg-accent">
                    <Text className="text-2xl font-sans-bold text-white">
                      {(user?.fullName || HOME_USER.name).split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </Text>
                  </View>
                  <Text className="home-user-name">
                      {user?.fullName || HOME_USER.name}
                  </Text>
                </View>

                <View>
                  <Image source={icons.add} className="home-add-icon"></Image>
                </View>

              </View>

                <View className="my-2.5 min-h-48 justify-between gap-5 rounded-bl-3xl rounded-tr-3xl bg-accent p-6">

                  <Text className="text-xl font-sans-semibold text-white/80">
                    Balance
                  </Text>
                  <View className="home-balance-row">
                    <Text className="home-balance-amount">
                      {formatCurrency(HOME_BALANCE.amount)}
                    </Text>
                    <Text className="home-balance-date">
                      {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                    </Text>
                  </View>
                </View>

              <View>
                <ListHeading title={"Upcoming"}></ListHeading>
                <FlatList data={UPCOMING_SUBSCRIPTIONS} 
                  renderItem={({item}) => (
                    <UpcomingSubscriptionsCard data={item}></UpcomingSubscriptionsCard>
                  )
                }
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
                />
              </View>

              <View className="mb-5"></View>
              <ListHeading title={"All Subscriptions"}></ListHeading>


            </>
          )
        }
        data={HOME_SUBSCRIPTIONS}
        renderItem={
          ({item}) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() => {
                const isExpanding = expandedSubscriptionId !== item.id;
                setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id));
                if (isExpanding) {
                  posthog.capture("subscription_card_expanded", {
                    subscription_id: item.id,
                    subscription_name: item.name,
                  });
                }
              }}
            ></SubscriptionCard>
          )
        }
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text className="">
            No Subscriptions yet.
          </Text>
        }
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={
          () => <View className="h-4"/>
        }
        contentContainerClassName="pb-30"
        />

    </SafeAreaView>
  );
}

import { formatCurrency } from '@/lib/utils'
import React from 'react'
import { Image, Text, View } from 'react-native'

const UpcomingSubscriptionsCard = ({data : {name, price, daysLeft, icon, currency}} : UpcomingSubscription) => {
  return (
    <View className='mr-4 w-44 rounded-2xl border-x-2 border-y-2 border-black bg-background p-4'>
      <View className='upcoming-row'>
        <Image source={icon} className='upcoming-icon'></Image>
        <View>
          <Text className='upcoming-price'>
              {formatCurrency(price,currency)}
          </Text>
          <Text className='upcoming-meta'>
            {daysLeft > 1 ? ` ${daysLeft} days left.` : 'Last day.'}
          </Text>
        </View>
      </View>

      <Text className='upcoming-name' numberOfLines={1} > {name} </Text>

    </View>
  ) 
}

export default UpcomingSubscriptionsCard

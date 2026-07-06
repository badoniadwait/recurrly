
import "@/app/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
          'regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
          'bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
          'extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
          'light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
          'medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
          'semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
      });
  
      useEffect(() => {
          if(fontsLoaded) {
              SplashScreen.hideAsync();
          }
      }, [fontsLoaded])
      if(!fontsLoaded) return null;
  
    return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>

      // <Tabs screenOptions={{headerShown: false}}>
      //       <Tabs.Screen name="(tabs)"></Tabs.Screen>
      // </Tabs>
        // <Stack screenOptions={{headerShown: false}}/>
    )
}

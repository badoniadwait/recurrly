import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Something went wrong");
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <View className="auth-screen">
        <View className="auth-scroll">
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurrly</Text>
                  <Text className="auth-wordmark-sub">Subscription Manager</Text>
                </View>
              </View>
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">Sign in to manage your subscriptions</Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className="auth-input"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    onChangeText={setEmailAddress}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className="auth-input"
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={setPassword}
                  />
                </View>

                {error ? <Text className="auth-error">{error}</Text> : null}

                <TouchableOpacity
                  className={`auth-button ${(!isLoaded || !emailAddress || !password) ? "auth-button-disabled" : ""}`}
                  disabled={!isLoaded || !emailAddress || !password}
                  onPress={onSignInPress}
                >
                  <Text className="auth-button-text">Sign In</Text>
                </TouchableOpacity>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Don't have an account?</Text>
                <Link href="/(auth)/sign-up" className="auth-link">Create one</Link>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

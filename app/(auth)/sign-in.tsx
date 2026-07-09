import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const posthog = usePostHog();
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

      if (completeSignIn.status !== "complete") {
        setError("Additional verification required");
        return;
      }

      if (!completeSignIn.createdSessionId) {
        setError("No session created");
        return;
      }

      await setActive({ session: completeSignIn.createdSessionId });
      posthog.identify(completeSignIn.createdSessionId, {
        $set: { email: emailAddress },
      });
      posthog.capture("user_signed_in");
      router.replace("/(tabs)");
    } catch (err: any) {
      const message = err.errors?.[0]?.longMessage || "Something went wrong";
      setError(message);
      posthog.capture("user_sign_in_failed", { error_message: message });
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="auth-scroll"
          keyboardShouldPersistTaps="handled"
          bounces={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

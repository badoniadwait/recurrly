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
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [verificationFactor, setVerificationFactor] = React.useState<"first" | "second">("first");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  const finishSignIn = async (createdSessionId: string) => {
    if (!setActive) {
      setError("Unable to activate session");
      return;
    }

    await setActive({ session: createdSessionId });
    posthog.identify(createdSessionId, {
      $set: { email: emailAddress.trim() },
    });
    posthog.capture("user_signed_in");
    router.replace("/(tabs)");
  };

  const startEmailCodeVerification = async (factor: "first" | "second") => {
    if (!signIn) return false;

    const factors =
      factor === "first" ? signIn.supportedFirstFactors : signIn.supportedSecondFactors;
    const emailCodeFactor = factors?.find((item) => item.strategy === "email_code");

    if (!emailCodeFactor) {
      return false;
    }

    if (factor === "first") {
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailCodeFactor.emailAddressId,
      });
    } else {
      await signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: emailCodeFactor.emailAddressId,
      });
    }

    setVerificationFactor(factor);
    setPendingVerification(true);
    return true;
  };

  const onSignInPress = async () => {
    if (!isLoaded || !signIn) return;
    setError("");

    try {
      const completeSignIn = await signIn.create({
        strategy: "password",
        identifier: emailAddress.trim(),
        password,
      });

      if (completeSignIn.status !== "complete") {
        if (completeSignIn.status === "needs_first_factor") {
          const prepared = await startEmailCodeVerification("first");
          if (prepared) {
            return;
          }
        }

        if (completeSignIn.status === "needs_second_factor") {
          const prepared = await startEmailCodeVerification("second");
          if (prepared) {
            return;
          }
        }

        if (completeSignIn.status === "needs_new_password") {
          setError("Please reset your password before signing in.");
          return;
        }

        setError("Additional verification required");
        return;
      }

      if (!completeSignIn.createdSessionId) {
        setError("No session created");
        return;
      }

      await finishSignIn(completeSignIn.createdSessionId);
    } catch (err: any) {
      const message = err.errors?.[0]?.longMessage || "Something went wrong";
      setError(message);
      posthog.capture("user_sign_in_failed", { error_message: message });
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !signIn) return;
    setError("");

    try {
      const completeSignIn =
        verificationFactor === "first"
          ? await signIn.attemptFirstFactor({
              strategy: "email_code",
              code,
            })
          : await signIn.attemptSecondFactor({
              strategy: "email_code",
              code,
            });

      if (completeSignIn.status === "needs_second_factor") {
        const prepared = await startEmailCodeVerification("second");
        if (!prepared) {
          setError("Two-factor authentication required");
        }
        return;
      }

      if (completeSignIn.status !== "complete" || !completeSignIn.createdSessionId) {
        setError("Verification incomplete");
        return;
      }

      await finishSignIn(completeSignIn.createdSessionId);
    } catch (err: any) {
      const message = err.errors?.[0]?.longMessage || "Something went wrong";
      setError(message);
    }
  };

  if (pendingVerification) {
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
                <Text className="auth-title">Check your email</Text>
                <Text className="auth-subtitle">Enter the verification code we sent to {emailAddress}</Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className="auth-input"
                      value={code}
                      placeholder="Enter verification code"
                      placeholderTextColor="#999"
                      onChangeText={setCode}
                      keyboardType="number-pad"
                    />
                  </View>

                  {error ? <Text className="auth-error">{error}</Text> : null}

                  <TouchableOpacity
                    className={`auth-button ${(!isLoaded || !code) ? "auth-button-disabled" : ""}`}
                    disabled={!isLoaded || !code}
                    onPress={onVerifyPress}
                  >
                    <Text className="auth-button-text">Verify Email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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

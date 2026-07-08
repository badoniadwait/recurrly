import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      await signUp.create({ firstName, lastName, emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Something went wrong");
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: completeSignUp.createdSessionId });
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || "Something went wrong");
    }
  };

  if (pendingVerification) {
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
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text className="auth-title">Create account</Text>
              <Text className="auth-subtitle">Start managing all your subscriptions in one place</Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">First Name</Text>
                  <TextInput
                    className="auth-input"
                    autoCapitalize="words"
                    value={firstName}
                    placeholder="Enter your first name"
                    placeholderTextColor="#999"
                    onChangeText={setFirstName}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Last Name</Text>
                  <TextInput
                    className="auth-input"
                    autoCapitalize="words"
                    value={lastName}
                    placeholder="Enter your last name"
                    placeholderTextColor="#999"
                    onChangeText={setLastName}
                  />
                </View>

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
                    placeholder="Create a password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    onChangeText={setPassword}
                  />
                </View>

                {error ? <Text className="auth-error">{error}</Text> : null}

                <TouchableOpacity
                  className={`auth-button ${(!isLoaded || !emailAddress || !password) ? "auth-button-disabled" : ""}`}
                  disabled={!isLoaded || !emailAddress || !password}
                  onPress={onSignUpPress}
                >
                  <Text className="auth-button-text">Create Account</Text>
                </TouchableOpacity>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Already have an account?</Text>
                <Link href="/(auth)/sign-in" className="auth-link">Sign in</Link>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

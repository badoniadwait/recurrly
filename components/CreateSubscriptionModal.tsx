import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

const CATEGORY_OPTIONS = [
    "Entertainment",
    "AI Tools",
    "Developer Tools",
    "Design",
    "Productivity",
    "Cloud",
    "Music",
    "Other",
] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
    Entertainment: "#f7c8d6",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    Design: "#f5c542",
    Productivity: "#b8e8d0",
    Cloud: "#b8d9ff",
    Music: "#c9e6a0",
    Other: "#f6eecf",
};

type Frequency = "Monthly" | "Yearly";

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
    visible,
    onClose,
    onCreate,
}: CreateSubscriptionModalProps) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("Monthly");
    const [category, setCategory] =
        useState<(typeof CATEGORY_OPTIONS)[number]>("Entertainment");
    const [error, setError] = useState("");

    const parsedPrice = useMemo(() => Number(price), [price]);
    const isValid = name.trim().length > 0 && Number.isFinite(parsedPrice) && parsedPrice > 0;

    const resetForm = () => {
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory("Entertainment");
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        if (!isValid) {
            setError("Enter a name and a positive price.");
            return;
        }

        const startDate = dayjs();
        const renewalDate = startDate.add(1, frequency === "Monthly" ? "month" : "year");
        const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        onCreate({
            id: `${slug || "subscription"}-${Date.now()}`,
            name: name.trim(),
            price: parsedPrice,
            frequency,
            category,
            status: "active",
            startDate: startDate.toISOString(),
            renewalDate: renewalDate.toISOString(),
            icon: icons.wallet,
            billing: frequency,
            color: CATEGORY_COLORS[category],
            currency: "USD",
            plan: `${frequency} Plan`,
            paymentMethod: "Not provided",
        });

        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="modal-overlay"
            >
                <Pressable className="flex-1" onPress={handleClose} />
                <View className="modal-container">
                    <View className="modal-header">
                        <Text className="modal-title">New Subscription</Text>
                        <Pressable
                            className="modal-close"
                            accessibilityRole="button"
                            accessibilityLabel="Close new subscription modal"
                            onPress={handleClose}
                        >
                            <Text className="modal-close-text">x</Text>
                        </Pressable>
                    </View>

                    <View className="modal-body">
                        <View className="auth-field">
                            <Text className="auth-label">Name</Text>
                            <TextInput
                                className="auth-input"
                                placeholder="Subscription name"
                                placeholderTextColor="#999"
                                value={name}
                                autoCapitalize="words"
                                onChangeText={(value) => {
                                    setName(value);
                                    setError("");
                                }}
                            />
                        </View>

                        <View className="auth-field">
                            <Text className="auth-label">Price</Text>
                            <TextInput
                                className="auth-input"
                                placeholder="0.00"
                                placeholderTextColor="#999"
                                value={price}
                                keyboardType="decimal-pad"
                                onChangeText={(value) => {
                                    setPrice(value);
                                    setError("");
                                }}
                            />
                        </View>

                        <View className="auth-field">
                            <Text className="auth-label">Frequency</Text>
                            <View className="picker-row">
                                {(["Monthly", "Yearly"] as const).map((option) => {
                                    const isActive = frequency === option;

                                    return (
                                        <Pressable
                                            key={option}
                                            className={clsx(
                                                "picker-option",
                                                isActive && "picker-option-active"
                                            )}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Select ${option.toLowerCase()} frequency`}
                                            accessibilityState={{ selected: isActive }}
                                            onPress={() => setFrequency(option)}
                                        >
                                            <Text
                                                className={clsx(
                                                    "picker-option-text",
                                                    isActive && "picker-option-text-active"
                                                )}
                                            >
                                                {option}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="auth-field">
                            <Text className="auth-label">Category</Text>
                            <View className="category-scroll">
                                {CATEGORY_OPTIONS.map((option) => {
                                    const isActive = category === option;

                                    return (
                                        <Pressable
                                            key={option}
                                            className={clsx(
                                                "category-chip",
                                                isActive && "category-chip-active"
                                            )}
                                            accessibilityRole="button"
                                            accessibilityLabel={`Select ${option} category`}
                                            accessibilityState={{ selected: isActive }}
                                            onPress={() => setCategory(option)}
                                        >
                                            <Text
                                                className={clsx(
                                                    "category-chip-text",
                                                    isActive && "category-chip-text-active"
                                                )}
                                            >
                                                {option}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        {error ? <Text className="auth-error">{error}</Text> : null}

                        <Pressable
                            className={clsx("auth-button", !isValid && "auth-button-disabled")}
                            accessibilityRole="button"
                            accessibilityLabel="Create subscription"
                            onPress={handleSubmit}
                        >
                            <Text className="auth-button-text">Create Subscription</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CreateSubscriptionModal;

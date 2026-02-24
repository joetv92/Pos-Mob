import axios from "@/src/api/axios";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
export default function Login() {
    const [name, setName] = useState("");
    const [pin, setPin] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("/login", {
                name,
                pin,
            });

            const token = response.data.token;
            const user = response.data.user;

            await SecureStore.setItemAsync('token', token);
            await SecureStore.setItemAsync("user", JSON.stringify(user));

            router.replace("/(tabs)");
        } catch (error) {
            console.log("Login error", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput
                placeholder="name"
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="pin"
                secureTextEntry
                onChangeText={setPin}
                style={styles.input}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { borderWidth: 1, marginBottom: 10, padding: 10 },
});
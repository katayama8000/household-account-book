import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { defaultFontSize, defaultFontWeight } from "@/style/defaultStyle";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignInScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("サインインしました");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <View style={[styles.inputContainer, styles.mt20]}>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="example@gmail.com"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          style={[styles.buttonContainer, styles.mt20]}
          onPress={() => signInWithEmail()}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.primary,
  },
  inputContainer: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  input: {
    height: 40,
  },
  buttonContainer: {
    borderRadius: 8,
    backgroundColor: Colors.primary,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: defaultFontSize,
    fontWeight: defaultFontWeight,
    color: "white",
  },
  mt20: {
    marginTop: 20,
  },
});

export default SignInScreen;

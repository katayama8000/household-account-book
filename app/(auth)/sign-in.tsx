import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { defaultFontSize, defaultFontWeight } from "@/style/defaultStyle";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

const SignInScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setOptions } = useNavigation();
  const { push } = useRouter();

  useEffect(() => {
    setOptions({ headerTitle: "ログイン" });
  }, [setOptions]);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      ToastAndroid.show("ログインした", ToastAndroid.SHORT);
      push({ pathname: "/" });
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>もうふといくら</Text>
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
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>ログイン</Text>}
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
    fontWeight: defaultFontWeight,
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
function setOptions(arg0: { headerTitle: string }) {
  throw new Error("Function not implemented.");
}

import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity } from "react-native";
import { usePayment } from "../hooks/usePayment";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function PaymentModalScreen() {
  const { payments, addPayment, updatePayment, setName, setAmount, name, amount } = usePayment();
  const { kind, id } = useLocalSearchParams();
  const { setOptions } = useNavigation();
  setOptions({
    headerTitle: kind === "edit" ? "編集" : "支払い",
  });

  useEffect(() => {
    if (kind === "edit" && id) {
      if (typeof id === "string") {
        console.log(id);
        const payment = payments.find((p) => p.id === Number(id));
        if (payment) {
          setName(payment.name);
          setAmount(Number(payment.amount));
        } else {
          alert("payment not found");
        }
      }
    }
  }, [kind, id, setName, setAmount, payments]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>項目</Text>
        <TextInput style={styles.input} value={name ? name.toString() : ""} onChangeText={(text) => setName(text)} />
      </View>
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>値段</Text>
        <TextInput
          style={styles.input}
          value={amount ? amount.toString() : ""}
          onChangeText={(text) => setAmount(Number(text))}
          keyboardType={Platform.select({ ios: "number-pad", android: "numeric" })}
          numberOfLines={1}
        />
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            if (kind === "edit") {
              if (name && amount) {
                updatePayment(Number(id), { name, amount });
              }
            } else {
              addPayment();
            }
          }}
          disabled={!name || !amount}
        >
          <Text style={{ color: "#fff" }}>{kind === "edit" ? "更新" : "登録"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#282c34",
    paddingTop: Platform.OS === "android" ? 40 : 0, // Android用に上部パディングを追加
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  formWrapper: {
    marginBottom: 20,
    width: "100%",
  },
  inputLabel: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 16,
    color: "#fff",
    backgroundColor: "#333",
    paddingHorizontal: 10,
  },
  submitButton: {
    marginTop: 12,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

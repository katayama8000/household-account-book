import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity } from "react-native";
import { usePayment } from "../hooks/usePayment";
import { useLocalSearchParams } from "expo-router";

export default function PaymentModalScreen() {
  const { addPayment, updatePayment, setName, setAmount, name, amount } = usePayment();
  const { kind, id, name: nameQuery, amount: amountQuery } = useLocalSearchParams();

  useEffect(() => {
    if (kind === "edit" && id) {
      if (typeof nameQuery === "string" && typeof amountQuery === "string") {
        setName(nameQuery);
        setAmount(Number(amountQuery));
      }
    }
  }, [kind, id, nameQuery, amountQuery, setName, setAmount]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{kind === "edit" ? "Edit" : "Add"} Payment</Text>
      <Text style={styles.title}>Payment Modal</Text>
      {/* 項目名 */}
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>Item</Text>
        <TextInput style={styles.input} value={name ? name.toString() : ""} onChangeText={(text) => setName(text)} />
      </View>
      {/* 金額 */}
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>Price</Text>
        <TextInput
          style={styles.input}
          value={amount ? amount.toString() : ""}
          onChangeText={(text) => setAmount(Number(text))}
          keyboardType={Platform.select({ ios: "number-pad", android: "numeric" })}
          numberOfLines={1}
        />
      </View>
      {/* submitButton */}
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
          <Text style={{ color: "#fff" }}>{kind === "edit" ? "Update" : "Add"} Payment</Text>
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
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 0, // Android用に上部パディングを追加
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
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "#333",
    paddingHorizontal: 10,
    width: "100%",
  },
  submitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#4caf50",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
});

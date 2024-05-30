import React from "react";
import { Platform, StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity } from "react-native";

import { usePayment } from "../hooks/usePayment";

export default function PaymentModalScreen() {
  const { item, setItem, price, setPrice, count, setCount, addPayment, fetchAllPayments } = usePayment();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment Modal</Text>
      {/* itemForm */}
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>Item</Text>
        <TextInput style={styles.input} onChangeText={setItem} value={item ?? ""} numberOfLines={3} />
      </View>
      {/* priceForm */}
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>Price</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPrice(Number(text))}
          value={price ? price.toString() : ""}
          keyboardType={Platform.select({ ios: "number-pad", android: "numeric" })}
          numberOfLines={1}
        />
      </View>
      {/* countForm */}
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>Count</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setCount(Number(text))}
          value={count ? count.toString() : ""}
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
            addPayment();
            fetchAllPayments();
          }}
          disabled={!item || !price || !count}
        >
          <Text style={{ color: "#fff" }}>登録</Text>
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

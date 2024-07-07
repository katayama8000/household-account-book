import { Colors } from "@/constants/Colors";
import { useUser } from "@/hooks/useUser";
import { coupleIdAtom } from "@/state/couple.state";
import { userAtom } from "@/state/user.state";
import { defaultFontSize, defaultFontWeight } from "@/style/defaultStyle";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { usePayment } from "../../hooks/usePayment";
import { activeInvoiceAtom } from "../../state/invoice.state";

const PaymentModalScreen = () => {
  const { payments, addPayment, updatePayment, setName, setAmount, name, amount, fetchPaymentsAllByMonthlyInvoiceId } =
    usePayment();
  const { fetchPartner } = useUser();
  const { kind, id } = useLocalSearchParams();
  const { setOptions } = useNavigation();
  const [activeInvoce] = useAtom(activeInvoiceAtom);
  const [couple_id] = useAtom(coupleIdAtom);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    setOptions({
      headerTitle: kind === "edit" ? "編集" : "支払い",
      headerTitleStyle: { fontSize: 22, color: Colors.white },
      headerStyle: { backgroundColor: Colors.primary },
    });

    if (kind === "edit" && typeof id === "string") {
      const payment = payments.find((p) => p.id === Number(id));
      if (payment) {
        setName(payment.name);
        setAmount(Number(payment.amount));
      } else {
        alert("payment not found");
      }
    }
  }, [kind, id, setName, setAmount, payments, setOptions]);

  const handlePayment = async () => {
    if (!name || !amount) {
      alert("Please enter both name and amount.");
      return;
    }
    if (couple_id === null || user === null) return;

    try {
      const partner = await fetchPartner(couple_id, user.user_id);
      if (partner === undefined) return;

      if (kind === "edit" && id) {
        await updatePayment(Number(id), { name, amount });
      } else {
        await addPayment();
      }

      console.log("expo_push_token:", partner.expo_push_token);

      await sendPushNotification(partner.expo_push_token, user.name, name, amount, kind as string);

      if (activeInvoce) {
        await fetchPaymentsAllByMonthlyInvoiceId(activeInvoce.id);
      }
    } catch (error) {
      console.error("An error occurred while handling the payment:", error);
      alert("An error occurred while processing the payment. Please try again later.");
    }
  };

  const sendPushNotification = async (
    expoPushToken: string,
    name: string,
    item: string,
    amount: number,
    kind: string,
  ) => {
    const message = {
      title: `${name}が${kind === "edit" ? "項目を更新しました" : "支払いました"}`,
      body: `${item} ${amount}円`,
      expo_push_tokens: expoPushToken,
    };

    try {
      await fetch("https://expo-push-notification-api-rust.vercel.app/api/handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>項目</Text>
        <TextInput style={styles.input} value={name ?? ""} onChangeText={(text) => setName(text)} />
      </View>
      <View style={styles.formWrapper}>
        <Text style={styles.inputLabel}>値段</Text>
        <TextInput
          style={styles.input}
          value={amount ? amount.toString() : ""}
          onChangeText={(text) => setAmount(Number(text.replace(/[^0-9]/g, "")))}
          keyboardType={Platform.select({ android: "numeric" })}
        />
      </View>
      <View style={styles.submitWrapper}>
        <TouchableOpacity style={styles.submitButton} onPress={handlePayment} disabled={!name || !amount}>
          <Text style={styles.submitButtonText}>{kind === "edit" ? "更新" : "登録"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : 0, // Android用に上部パディングを追加
    paddingHorizontal: 16,
  },
  formWrapper: {
    marginVertical: 12,
    width: "100%",
  },
  inputLabel: {
    fontSize: defaultFontSize,
    fontWeight: defaultFontWeight,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    fontWeight: defaultFontWeight,
  },
  submitWrapper: {
    width: "100%",
    alignItems: "center",
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: defaultFontSize,
    fontWeight: defaultFontWeight,
  },
});

export default PaymentModalScreen;

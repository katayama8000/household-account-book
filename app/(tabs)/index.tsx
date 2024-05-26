import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import { useEffect, useState, type FC } from "react";
import { supabase } from "@/lib/supabase";
import { dev_payments } from "@/constants/Table";
import type { Database } from "@/types/supabase";

type Payment = Database["public"]["Tables"]["dev_payments"]["Row"];

export default function HomeScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { push } = useRouter();
  const fetchAllPayments = async () => {
    console.log("fetching all payments");
    setIsRefreshing(true);
    const { data, status, error } = await supabase.from(dev_payments).select("*");
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setPayments(data);
    }
    setIsRefreshing(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchAllPayments();
  }, []);

  return (
    <View style={{}}>
      <Text
        style={{
          color: "white",
          fontSize: 24,
          marginBottom: 24,
        }}
      >
        Home Screen
      </Text>

      <TouchableOpacity
        style={{
          borderRadius: 50,
          marginBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#4caf50",
          width: 80,
          padding: 4,
        }}
        onPress={() => {
          push("/payment-modal");
        }}
      >
        <AntDesign name="pluscircleo" size={24} color="white" />
        <Text
          style={{
            color: "white",
            fontSize: 16,
            paddingHorizontal: 8,
          }}
        >
          追加
        </Text>
      </TouchableOpacity>

      <FlatList
        data={payments}
        renderItem={({ item }) => <Payment payment={item} routerPush={push} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={() => <Text>No items</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
        onRefresh={(): void => {
          // get items from server
          // console.log("refresh");
          fetchAllPayments();
        }}
        // set refreshing to true when loading items from server
        refreshing={isRefreshing}
      />
    </View>
  );
}

type PaymentProps = {
  routerPush: (href: ExpoRouter.Href) => void;
  payment: Payment;
};

const Payment: FC<PaymentProps> = ({ routerPush, payment }) => {
  return (
    <View
      style={{
        backgroundColor: "#f0f8ff",
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Item info container */}
      <View style={{ flex: 1 }}>
        {/* item name */}
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>name</Text>
        <Text style={{ fontSize: 14 }}>{payment.name}</Text>
        {/* count */}
        <Text style={{ fontSize: 14 }}>Count</Text>
        <Text style={{ fontSize: 14 }}>{payment.quantity}</Text>
        {/* price */}
        <Text style={{ fontSize: 14 }}>Price</Text>
        <Text style={{ fontSize: 14 }}>{payment.amount}</Text>
      </View>
      {/* Edit and Delete buttons container */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* edit */}
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "#4caf50",
            borderRadius: 5,
            marginRight: 8,
          }}
          onPress={() => {
            routerPush("/payment-modal");
          }}
        >
          <Text style={{ color: "#fff" }}>Edit</Text>
        </TouchableOpacity>
        {/* delete */}
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "#ff6347",
            borderRadius: 5,
          }}
          onPress={() => {
            Alert.alert("Alert Title", "My Alert Msg", [
              {
                text: "OK",
                onPress: () => {},
              },
              { text: "No", onPress: () => {} },
            ]);
          }}
        >
          <Text style={{ color: "#fff" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DeleteModal: FC = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#282c34",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 24 }}>Delete Item?</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          marginTop: 24,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "#4caf50",
            borderRadius: 5,
          }}
          onPress={() => {}}
        >
          <Text style={{ color: "#fff" }}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "#ff6347",
            borderRadius: 5,
          }}
          onPress={() => {}}
        >
          <Text style={{ color: "#fff" }}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

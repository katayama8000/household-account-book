import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import type { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import dayjs from "dayjs";

export default function PastInvoicesScreen() {
  const { push } = useRouter();
  const dummyMonth = [
    dayjs().format("YYYY-MM"),
    dayjs().subtract(1, "month").format("YYYY-MM"),
    dayjs().subtract(2, "month").format("YYYY-MM"),
    dayjs().subtract(3, "month").format("YYYY-MM"),
    dayjs().subtract(4, "month").format("YYYY-MM"),
    dayjs().subtract(5, "month").format("YYYY-MM"),
    dayjs().subtract(6, "month").format("YYYY-MM"),
    dayjs().subtract(7, "month").format("YYYY-MM"),
    dayjs().subtract(8, "month").format("YYYY-MM"),
    dayjs().subtract(9, "month").format("YYYY-MM"),
    dayjs().subtract(10, "month").format("YYYY-MM"),
    dayjs().subtract(11, "month").format("YYYY-MM"),
  ] as const;
  return (
    <View>
      <Text>Past Screen</Text>
      <FlatList
        data={dummyMonth}
        renderItem={({ item }) => <MonthlyInvoice month={item} total={1000} routerPush={push} />}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={() => <Text>No items</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
        onRefresh={(): void => {
          // get items from server
          console.log("refresh");
        }}
        // set refreshing to true when loading items from server
        refreshing={false}
      />
    </View>
  );
}

type MonthlyInvoiceProps = {
  month: string;
  total: number;
  routerPush: (href: ExpoRouter.Href) => void;
};

const MonthlyInvoice: FC<MonthlyInvoiceProps> = ({ month, total, routerPush }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#4caf50",
        padding: 16,
        borderRadius: 8,
        margin: 8,
      }}
      onPress={() => {
        routerPush("/past-invoice-details");
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          marginBottom: 24,
        }}
      >
        {month}
      </Text>
      <Text>合計: {total}</Text>
    </TouchableOpacity>
  );
};

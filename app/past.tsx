import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import type { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native";

export default function PastScreen() {
  const { push } = useRouter();
  const dummyMonth = [
    "2021-01",
    "2021-02",
    "2021-03",
    "2021-04",
    "2021-05",
    "2021-06",
    "2021-07",
    "2021-08",
    "2021-09",
    "2021-10",
    "2021-11",
    "2021-12",
  ] as const;
  return (
    <View>
      <Text>Past Screen</Text>
      <FlatList
        data={dummyMonth}
        renderItem={({ item }) => <PastMonth month={item} total={1000} routerPush={push} />}
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

type PastMonthProps = {
  month: string;
  total: number;
  routerPush: (href: ExpoRouter.Href) => void;
};

const PastMonth: FC<PastMonthProps> = ({ month, total, routerPush }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#4caf50",
        padding: 16,
        borderRadius: 8,
        margin: 8,
      }}
      onPress={() => {
        routerPush("/home");
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

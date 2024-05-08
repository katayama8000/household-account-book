import { Text, View } from "@/components/Themed";
import type { FC } from "react";
import { FlatList } from "react-native";

type Props = {
  number: number;
};
const ListItem: FC<Props> = ({ number }) => {
  return (
    <View
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#fff",
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Sample List Item {number}
      </Text>
      <View
        style={{
          position: "absolute",
          right: 16,
          top: 16,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          ...
        </Text>
      </View>
    </View>
  );
};

export default function SampleScreen() {
  return (
    <View>
      <Text>Sample Screen</Text>
      <FlatList
        data={Array.from({ length: 10 }, (_, i) => i)}
        renderItem={({ item }) => <ListItem number={item} />}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
}

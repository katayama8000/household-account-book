import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ExpoRouter } from "expo-router/types/expo-router";
import type { FC } from "react";

export default function HomeScreen() {
  const { push } = useRouter();
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
          push("/itemModal");
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
        data={[1, 2, 3, 4, 5, 6, 7]}
        renderItem={({ item }) => <Item routerPush={push} />}
        keyExtractor={(item) => item.toString()}
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

type ItemProps = {
  routerPush: (href: ExpoRouter.Href) => void;
};

const Item: FC<ItemProps> = ({ routerPush }) => {
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
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Item</Text>
        {/* count */}
        <Text style={{ fontSize: 14 }}>Count</Text>
        {/* price */}
        <Text style={{ fontSize: 14 }}>Price</Text>
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
            routerPush("/itemModal");
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

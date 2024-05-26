import { View, Text, Button } from "react-native";

export default function SampleScreen() {
  const addData = async () => {};
  return (
    <View>
      <Text>Sample Screen</Text>
      <Button
        title="add data to supabase"
        onPress={() => {
          console.log("add data to supabase");
          addData();
        }}
      />
    </View>
  );
}

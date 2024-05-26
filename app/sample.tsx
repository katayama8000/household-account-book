import { supabase } from "@/lib/supabase";
import { View, Text, Button } from "react-native";

export default function SampleScreen() {
  const addData = async () => {
    // const { data, error } = await supabase.from("sample").insert([
    //   { name: "John Doe", age: 25 },
    //   { name: "Jane Doe", age: 22 },
    // ]);
    // if (error) {
    //   console.log(error);
    //   alert(error.message);
    // }
    // if (data) {
    //   alert("Data inserted successfully");
    // }
  };
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

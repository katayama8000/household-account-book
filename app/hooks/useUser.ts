// import { dev_users } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { User as TUser } from "@/types/Row";
import { useState } from "react";

export const useUser = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const fetchExpoPushToken = async (uid: TUser["user_id"]) => {
    const { data, error } = await supabase.from("dev_users").select("expo_push_token").eq("user_id", uid);
    if (error) {
      console.error("error", error);
      return;
    }
    if (data.length === 0) {
      // insert expo_push_token
    } else {
      setExpoPushToken(data[0].expo_push_token);
    }
  };

  return { expoPushToken, fetchExpoPushToken };
};

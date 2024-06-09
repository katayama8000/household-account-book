import { dev_couples } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { Couple } from "@/types/Row";

export const useCouple = () => {
  const fetchCoupleIdByUserId = async (user_id: Couple["user1_id"] | Couple["user2_id"]) => {
    const user1 = await supabase.from(dev_couples).select("id").eq("user1_id", user_id).single();
    const user2 = await supabase.from(dev_couples).select("id").eq("user2_id", user_id).single();

    console.log("user1", user1);
    console.log("user2", user2);

    return user1.data?.id || user2.data?.id;
  };

  return { fetchCoupleIdByUserId };
};

import { dev_couples } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { Couple } from "@/types/Row";

export const useCouple = () => {
  const fetchCoupleIdByUserId = async (user_id: Couple["user1_id"] | Couple["user2_id"]) => {
    // FIXME: fix db schema text to array
    const user1 = await supabase.from(dev_couples).select("id").eq("user1_id", user_id).single();
    const user2 = await supabase.from(dev_couples).select("id").eq("user2_id", user_id).single();

    // if (user1.error || user2.error) {
    //   throw new Error("Failed to fetch couple id");
    // }
    return user1.data?.id || user2.data?.id;
  };

  return { fetchCoupleIdByUserId };
};

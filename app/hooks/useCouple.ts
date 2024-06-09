import { dev_couples } from "@/constants/Table";
import { supabase } from "@/lib/supabase";
import type { Couple } from "@/types/Row";

export const useCouple = () => {
  const fetchCoupleIdByUserId = async (user_id: Couple["user1_id"] | Couple["user2_id"]) => {
    const { data, error } = await supabase.from(dev_couples).select("id").eq("user2_id", user_id).single();

    if (error) {
      console.error(error);
      return null;
    }
    if (data) {
      return data.id;
    }
  };

  return { fetchCoupleIdByUserId };
};

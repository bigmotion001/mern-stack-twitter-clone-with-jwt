import API_URL from "../config/data";

// useUserProfile.js
import { useQuery } from "@tanstack/react-query";

// Ensure you have this environment variable set

export const useUserProfile = (username) => {
  return useQuery({
    queryKey: ["userprofile", username],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/profile/${username}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });
};

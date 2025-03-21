
import { useMutation,  useQueryClient } from "@tanstack/react-query";
import API_URL from "../config/data";
import toast from "react-hot-toast";

const useFollow = () => {
    const queryClient = useQueryClient();
    //follow
    const { mutate:followUser, isPending } = useMutation({
    
        mutationFn: async (userId) => {
          try {
            const res = await fetch(`${API_URL}/api/users/follow/${userId}`, {
              method: "POST",
              credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                
              throw new Error(data.message);
            }
    
            return data;
            
          } catch (error) {
            throw new Error(error);
          }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                toast.success("followed successful")
            ]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
      });
      return {followUser, isPending}
    
};

export default useFollow
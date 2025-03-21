import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API_URL from "../../config/data";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const RightPanel = () => {
	const queryClient = useQueryClient();
  //who to follow
  const { data: suggestedUser, isLoading } = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/suggested`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.message);
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  //follow
  const { mutate:followUser, isPending } = useMutation({
    
    mutationFn: async (id) => {
      try {
        const res = await fetch(`${API_URL}/api/users/follow/${id}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
			
          throw new Error(data.message);
        }

        return;
		
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

 

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUser?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.name}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
						e.preventDefault();
						followUser(user._id);
					}}
					
                  >
                  {isPending? (<LoadingSpinner/>):("Follow") }  
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";

import API_URL from "../../config/data"
import { useEffect } from "react";

const Posts = ({feedType}) => {



	const { data:posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
		  try {
			const res = await fetch(feedType === "following"? `${API_URL}/api/posts/following`:  `${API_URL}/api/posts/all`, {
			  method: "GET",
			  credentials: "include",
			});
	
			const data = await res.json();
			if (data.error) return null;
			if (!res.ok) {
				
			  throw new Error(data.message);
			  
			}
			console.log(data);
			return data;
		  } catch (error) {
			console.log(error);
			throw new Error(error);
		  }
		},
		retry: false,
	  });






useEffect(()=>{
	refetch();
},[feedType, refetch])

	

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching &&posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading &&!isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
// import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { PostContext } from "../../context/postContext";
const Posts = ({ feedType ,username,userId}) => {
	// const isLoading = false;
	const {isloading} = useContext(PostContext)
	const [posts,setPosts] = useState(null)
	const [isLoading , setIsLoading] = useState(false)
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/v1/posts/all"
			case "following":
				return "/api/v1/posts/following"
			case "posts":
				return `/api/v1/posts/user/${username}`
			case "likes":
				return `/api/v1/posts/likes/${userId}`
			default:
				return "/api/v1/posts/all"

		}
	}
	const POST_ENDPONIT = getPostEndpoint()
	const getAllPosts = async ()=>{
		try {
			setIsLoading(true)
			const res = await fetch(POST_ENDPONIT)
			const data = await res.json()
			if (!res.ok) {
				throw new Error(data.error)
			}
			setPosts(data)
		} catch (err) {
			throw new Error(err)
		}finally{
			setIsLoading(false)
		}
	}
	
	// const {
	// 	data: posts,
	// 	isLoading,
	// 	refetch,
	// } = useQuery({
	// 	queryKey: ["posts"],
	// 	queryFn: async () => {
	// 		try {
	// 			const res = await fetch(POST_ENDPONIT);
	// 			const data = await res.json();

	// 			if (!res.ok) {
	// 				throw new Error(data.error || "Something went wrong");
	// 			}

	// 			return data;
	// 		} catch (error) {
	// 			throw new Error(error);
	// 		}
	// 	},
	// });

	// useEffect(() => {
	// 	getAllPosts();
	// }, [feedType, refetch,isloading]);
	useEffect(()=>{
       getAllPosts()
	},[feedType,isloading,username])

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading  && posts && (
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
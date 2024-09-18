import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { formatMemberSinceDate } from "../../utils/date";
import { POSTS } from "../../utils/db/dummy";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";
import useFollow from "../../hooks/useFollow";
import useUpdateProfile from "../../hooks/useUpdateProfile";
const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [following, setfollowing] = useState(null)
	const [feedType, setFeedType] = useState("posts");
	const { follow } = useFollow()
	const { authUser, refrech } = useContext(AuthContext)
	const [user, setUser] = useState(null)
	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);
	const isLoading = false;
	const { username } = useParams()
	const memberSinceDate = formatMemberSinceDate(user?.createdAt);
	const getProfile = async () => {
		try {
			const res = await fetch(`/api/v1/user/profile/${username}`)
			const data = await res.json()
			if (!res.ok) throw new Error(data.error)
			setUser(data?.user)
		} catch (err) {
			toast.error(err.message)
		}
	}
	const getFollowers = async (id) => {
		try {
			const res = await fetch(`/api/v1/user/getfollowing/${id}`)
			const data = await res.json()
			if (!res.ok) throw new Error(data.error)
			setfollowing(data)
		} catch (err) {
			toast.error(err.message)
		}
	}
	useEffect(() => {
		getProfile()
	}, [username, refrech])
	
	let isMyProfile = authUser?._id === user?._id;
	const amIfollowing = authUser?.following?.includes(user?._id)
	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	const { updateProfile } = useUpdateProfile()

	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{isLoading && <ProfileHeaderSkeleton />}
				{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
								</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverImg || user?.coverImg || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover images'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} alt="" />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => follow(user?._id)}
									>
										{amIfollowing ? "UnFollow" : "Follow"}
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={(e) => {
											e.preventDefault()
											updateProfile({ coverImg, profileImg })
											setCoverImg(null)
											setProfileImg(null)
										}}
									>
										Update
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={user?.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{memberSinceDate}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
						
										<div
											className='flex gap-1 items-center cursor-pointer group'
											onClick={() =>{
												 document.getElementById("comments_modal").showModal()
												 getFollowers(user?._id)
							
												}}
										>

											<span className='font-bold text-xs'>{user?.following.length}</span>
											<span className='text-slate-500 text-xs'>Following</span>
										</div>
										<dialog id={`comments_modal`} className='modal border-none outline-none'>
											<div className='modal-box rounded border border-gray-600'>
												<h3 className='font-bold text-lg mb-4'>following</h3>
												<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
													{user?.following.length === 0 && (
														<p className='text-sm text-slate-500'>
															No following  yet 🤔 Be the first one 😉
														</p>
													)}

													{following?.map((user) => (
														<Link to={`/${user?.username}`}>
															<div key={user._id} className='flex gap-2 items-start'>
																<div className='avatar'>
																	<div className='w-8 rounded-full'>
																		<img
																			src={user.profileImg || "/avatar-placeholder.png"}
																			alt=""
																		/>
																	</div>
																</div>
																<div className='flex flex-col'>
																	<div className='flex items-center gap-1'>
																		<span className='font-bold'>{user.fullName}</span>
																		<span className='text-gray-700 text-sm'>
																			@{user.username}
																		</span>
																	</div>
																</div>
															</div>
														</Link>
													))}
												</div>
											</div>
											<form method='dialog' className='modal-backdrop'>
												<button className='outline-none'>close</button>
											</form>

										</dialog>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts feedType={feedType} username={username} userId={user?._id} />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;
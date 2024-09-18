import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import toast from "react-hot-toast";
import {BeatLoader} from "react-spinners"
import { AuthContext } from "../../../context/authContext";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",

	});
	const [Isloading, setIsloading] = useState(false)
	const [isError, setIsError] = useState(false)
	const {setAuthUser} = useContext(AuthContext)
	const Navigate = useNavigate()
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsloading(true)
			const res = await fetch("api/v1/auth/login", {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify(formData)
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error)
			setAuthUser(data)
			toast.success("User Login Succefully")
			Navigate("/")
		} catch (err) {
			setAuthUser(null)
			setIsError(true)
			toast.error(err.message)
		}finally{
			setIsloading(false)
		}

	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					{
						Isloading ? <BeatLoader className='btn btn-primary rounded-full' color="white"/>: <button className='btn rounded-full btn-primary text-white'>Login</button>
					}
					{isError && <p className='text-red-500'></p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
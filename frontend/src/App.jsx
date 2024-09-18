
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import Sidebar from './components/common/Sidebar';
import ProfilePage from './pages/profile/ProfilePage';
import NotificationPage from './pages/notification/NotificationPage';
import { Toaster } from 'react-hot-toast';
import RightPanel from './components/common/RightPanel';
// import { useQuery } from '@tanstack/react-query';
// import {ClipLoader} from 'react-spinners'
import { useContext, useEffect} from 'react';
import { AuthContext } from './context/authContext';

function App() {
	const {authUser,setAuthUser,refrech} = useContext(AuthContext)
	const getLoginUser = async ()=>{
		try{
			const res = await fetch("api/v1/auth/me")
			const data = await res.json()
			if(!res.ok){
				setAuthUser(null)
				throw new Error(data.error)
			}
			setAuthUser(data)
		}catch(err){
		   window.alert(err)
		}
	}

	
	useEffect(()=>{
		getLoginUser()
	},[refrech])
	return (
		<div className='flex max-w-6xl mx-auto'>
			{
				authUser && <Sidebar></Sidebar>
			}
			   <Routes>
				<Route path='/' element={authUser  ? <HomePage/> : <Navigate to="/login"></Navigate>} />
				<Route path='/signup' element={!authUser ? <SignUpPage />: <Navigate to="/"></Navigate>} />
				<Route path='/login' element={authUser ?<Navigate to="/"></Navigate> :<LoginPage />} />
				<Route path='/notifications' element={authUser ?<NotificationPage></NotificationPage>: <Navigate to="/login"></Navigate>}></Route>
				<Route path='/:username' element={ authUser  ? <ProfilePage></ProfilePage> : <Navigate to="/login"></Navigate>}></Route>
			   </Routes>
				{authUser &&  <RightPanel></RightPanel>}
			   <Toaster/>
		</div>

	);
}

export default App;

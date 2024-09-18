import {useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import { AuthContext } from "../context/authContext";
// import { useContext } from "react";

const useFollow =()=>{
    // const {authUser,setAuthUser} = useContext(AuthContext)
    const queryClient = useQueryClient();
    const follow = async (userId)=>{
        try{
            const res = await fetch(`api/v1/user/follow/${userId}`);
            const data = await res.json()
            if(!res.ok)throw new Error(data.error)
            toast.success(data.message)
            // setSeggestedUsers(!seggestedUsers) 
            queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] })
        }catch(err){
            toast.error(err.message)
        }
    }
    return {follow}

}
export default useFollow
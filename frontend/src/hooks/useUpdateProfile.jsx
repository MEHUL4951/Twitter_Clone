import { useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";

const useUpdateProfile = () => {
    const {refrech,setRefresh} = useContext(AuthContext)
    const updateProfile = async (formData) => {
        try {
            const res = await fetch(`/api/v1/user/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
          
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            toast.success(data.message)
            setRefresh(!refrech)
        } catch (error) {
           toast.error(error.message)
        }
    }
    return {updateProfile}
}
export default useUpdateProfile
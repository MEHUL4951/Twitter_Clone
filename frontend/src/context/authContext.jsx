import { createContext, useState } from "react";
export const AuthContext = createContext({
    authUser :null,
    seggestedUsers:null,
    refrech:false,
    setAuthUser :()=>{},
    setSeggestedUsers:()=>{},
    setRefresh:()=>{}

})
export const AuthProvider = ({
    children
})=>{
    const [authUser,setAuthUser] = useState(null)
    const [seggestedUsers,setSeggestedUsers] = useState(null)
    const [refrech,setRefresh] = useState(false)
    return (
        <AuthContext.Provider value={{authUser,setAuthUser,seggestedUsers,setSeggestedUsers,refrech,setRefresh}}>
         {children}
        </AuthContext.Provider>
    )
}
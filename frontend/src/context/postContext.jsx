import { createContext, useState } from "react";
export const PostContext = createContext({
    isloading:false,
    setIsLoading:()=>{},
})
export const PostProvider = ({
    children
})=>{
    const [isloading,setIsLoading] = useState(false)
    // const [seggestedUsers,setSeggestedUsers] = useState(null)
    return (
        <PostContext.Provider value={{isloading,setIsLoading}}>
         {children}
        </PostContext.Provider>
    )
}
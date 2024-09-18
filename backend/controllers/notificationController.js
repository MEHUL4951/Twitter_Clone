import Notification from "../models/notificationModel.js"

class notificationController
{
    static getNotifications = async(req,res)=>{
        try{

            const userId = req.user._id
            const notifications = await Notification.find({to:userId}).populate({
                path:"from",
                select:"username profileImg"

            })
            await Notification.updateMany({to:userId},{read:true})
            res.status(200).json(notifications)
        }catch(error){
            console.log("Error in getNotifications fuction",error.message)
            res.status(500).json({error:"internal server error"})
        }
         
    }
    static deleteNotifications = async (req,res)=>{
        try{
            const userId = req.user._id
            await Notification.deleteMany({to:userId})
            res.status(200).json({message:"Notifications deleted successfully"})

        }catch(err){
            console.log("error in deleteNotifications fuctions",err.message)
            res.status(500).json({error:"internal server error"})
        }
       
    }
    static deleteNotification = async (req,res)=>{
        try{

            const notificationId = req.params.id
            const userId = req.user._id
            const notification = await Notification.findById(notificationId)
            if(!notification){
                return res.status(404).json({error:"Notification not found"})
            }
            if(notification.to.toString() !== userId.toString()){
                return res.status(403).json({error:"you are not allowed to delete this notification"})
            }
            await Notification.deleteOne
            ({_id:notificationId})
            res.status(200).json({message:"Notification deleted successfully"})
        }catch(err){

            console.log("error in deleteNotification fuctions",err.message)
            res.status(500).json({error:"internal server error"})
        }

    }
}
export {notificationController}
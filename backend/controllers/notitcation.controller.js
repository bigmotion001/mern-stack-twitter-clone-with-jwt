import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";


export const getAllNotification = async (req, res) => {
    try {
        //get user id
        const userId = req.userId;
        
        //check if user exist
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        //get all notification
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        })
        //update notification
        await Notification.updateMany({ to: userId }, { read: true });
        res.status(200).json(notifications);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }

}



//delete 
export const deleteNotification = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.deleteMany({ to: userId });
        res.status(200).json({ message: "Notification deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });


    }
}
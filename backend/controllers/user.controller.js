import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";



//get user profile
export const getUserProfile = async (req, res) => {
    //get username from the params
    const username = req.params.username;

    try {

        //find user by username
        const user = await User.findOne({ username }).select("-password");
        console.log("username", user);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            message: "User found",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
        console.log(error.message);

    }
}

//follow and unfollow user
export const followAndUnfollowUser = async (req, res) => {

    try {
        //get the user id from the params/ id of the user we want to follow
        const { id } = req.params;
        //user i want to follow  or unfollow
        const userToFollow = await User.findById(id);


        //current user // myself
        const currentUser = await User.findById(req.userId);

        //user can't follow themselves
        if (id === req.userId) {
            return res.status(400).json({ success: false, message: "You can't follow yourself" });
        }
        //check if user is found/ if both id are valid
        if (!userToFollow || !currentUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        //check if we are following the user/ if im following the user
        const isFollowing = currentUser.following.includes(id);
        //if we are following the user / if im following the other user -- unfollow
        if (isFollowing) {
            //unfollow the user/ remove my id from the followers list of the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.userId } });
            //update our following list/ remove the user id from my following list
            await User.findByIdAndUpdate(req.userId, { $pull: { following: id } });
            return res.status(200).json({ success: true, message: "Unfollowed user" });
        }
        else {
            //follow the user/ add my id to the followers list of the user
            await User.findByIdAndUpdate(id, { $push: { followers: req.userId } });
            //update our following list / add the user id to my following list
            await User.findByIdAndUpdate(req.userId, { $push: { following: id } });
            //send a notification to the user
            const newNotification = new Notification({
                from: req.userId,
                to: id,
                type: "follow",
            });
            //save the notification
            await newNotification.save();

            return res.status(200).json({ success: true, message: "Followed user" });

        }



    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
        console.log(error.message);

    }


}


//get suggested users
export const getSuggestedUsers = async (req, res) => {
    const userId = req.userId;

    try {




        //all users followed by the current user
        const usersFollowedByMe = await User.findById(userId).select("following");


        //get all users except the current user
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            { $sample: { size: 10 } },
        ]);

        //filter out the users that are already followed by the current user
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));


        //suggested users
        const suggestedUsers = filteredUsers.slice(0, 4);
        //do not include the password
        suggestedUsers.forEach((user) => (user.password = undefined));
        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
        res.status(500).json({ error: error.message });

    }
}


//update user profile
export const updateUserProfile = async (req, res) => {
    const {name, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.userId;

    try {
        //check if the user exists
        let user = await User.findById(userId);
        
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        //check if user passed the current password with not the new password or vice versa
        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ success: false, message: "Please provide both current and new password" });
        }
        //if user passed both current and new password
        if (currentPassword && newPassword) {
			const isMatch = await bcryptjs.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}
            

			const salt = await bcryptjs.genSalt(10);
			user.password = await bcryptjs.hash(newPassword, salt);
		}

            //check if user passed the profile image
            if (profileImg) {
                //if user already has a profile image, delete the previous one from cloudinary
                if (user.profileImg) {
                  
                    await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
                }
                //upload the profile image to cloudinary
                const uploadedProfileImg = await cloudinary.uploader.upload(profileImg);
                profileImg = uploadedProfileImg.secure_url;
            }

            //check if user passed the cover image
            if (coverImg) {
                //if user already has a cover image, delete the previous one from cloudinary
                if (user.coverImg) {
                    await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
                }
                const uploadedCoverImg = await cloudinary.uploader.upload(coverImg);
                coverImg = uploadedCoverImg.secure_url;
            }
            //update the user
            user.name = name || user.name;
            user.email = email || user.email;
            user.username = username || user.username;
            user.bio = bio || user.bio;
            user.link = link || user.link;
            user.profileImg = profileImg || user.profileImg;
            user.coverImg = coverImg || user.coverImg;
          user =  await user.save();
          user.password = undefined;
            return res.status(200).json({ success: true, message: "Profile updated", user });
        
        
    } catch (error) {
        console.log("Error in updateUserProfile: ", error.message);
        res.status(500).json({ error: error.message });
        
    }
}

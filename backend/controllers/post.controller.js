import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {

    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.userId;
        //check if user exist
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found" });

        //check if text or img is empty
        if (!text && !img) return res.status(400).json({ message: "Post most have a text or image" });

        //if there is an image, upload it to cloudinary
        if (img) {
            const uploadResult = await cloudinary.uploader.upload(img);

            img = uploadResult.secure_url;
        }

        //create post
        const post = await new Post({
            user: userId,
            text,
            img,
        }).save();
        return res.status(201).json(post);


    } catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error.message);

    }
}

//delete post
export const deletePost = async (req, res) => {
    const userId = req.userId;
    try {
        const postId = req.params.id;
     
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({
            message: "Post not found"
        });
        //check if user is the owner of the post
        if (post.user.toString() !== userId.toString()) return res.status(400).json({
            message: "You can't delete this post"
        });

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }


        //delete post
        await Post.findByIdAndDelete(postId)
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error.message);
    }
}

//comment on post
export const commentOnPost = async (req, res) => {
    const userId = req.userId;
    const { text } = req.body;
    const postId = req.params.id;

    try {
        //check if text is empty
        if (!text) return res.status(400).json({ message: "Please enter a comment" });

        //check if userid exits
        if (!userId) return res.status(400).json({ message: "User not found" });

        //check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        } else {
            //create a new comment
            const comment = { user: userId, text };
            post.comments.push(comment);
            await post.save();
            return res.status(200).json({ message: "Comment created successfully" });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error.message);


    }
}

//like and unlike post
export const likeUnlikePost = async (req, res) => {
    const userId = req.userId;
    const postId = req.params.id;
    try {
        //check if post id exist
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ message: "Post not found" });
        //check if user like the post already
        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            //remove user from likes array
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            //remove the post id from user likedposts
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId}});
            res.status(201).json({ message: "Post unliked" });
        } else {
            //add user to likes array
            post.likes.push(userId);
            //add to user likesposts
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId}});
            await post.save();
            //send notification
            const newNotification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await newNotification.save();

            res.status(201).json({ message: "Post Liked" });
        }


    } catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error.message);

    }
}

//get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        }).populate({
            path: "likes.user",
            select: "-password",
        });
        if (posts.length === 0) {
			return res.status(200).json([]);
		}
        return res.status(200).json(posts)

        
    } catch (error) {

        return res.status(500).json({ message: error.message });
        console.log(error.message);
    }
}

//get liked post by user
export const getLikedPostByUser = async (req,res)=>{

    const userId = req.params.id;
   
    try {
        //find user by id
        const user = await User.findById(userId);
       
        if(!user){
            return res.status(404).json({message:"User not found"})
            }
        //find all posts user liked
       
		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });

    res.status(200).json(likedPosts);
} catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
}
}

//get post of user we are follwoing
export const postOfUsersWeFollowing = async (req,res)=>{
    try {
        //current user id
        const userId = req.userId;
        //check if user exist
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({message: "User not found"});
        //get all users we are following
        const following = user.following;
        const postfeed = await Post.find({user: {$in: following}}).sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json(postfeed);
    } catch (error) {
        console.log("Error in following userPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
        
    }
}

//get user posts
export const getUserPosts = async (req,res)=>{

    try {
        //get user name from params
        const {username} = req.params;
        //check if user exist
        const user = await User.findOne({username});
        if(!user) return res.status(400).json({message: "User not found"});
        //get all posts of user
        const posts = await Post.find({user: user._id}).sort({ createdAt: -1})
        .populate({
            path: "user",
            select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
                });
                res.status(200).json(posts);
        
    } catch (error) {
        console.log("Error in userPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
        
    }
}
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utilis/generateTokenAndSetCookie.js";

export const register = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        //check if email is email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        //check if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        //check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }
        //check if password is atleast 6 characters long
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be atleast 6 characters long" });
        }
        //hash password
        const salt = await bcryptjs.genSalt(10);// 10 rounds of hashing
        const hashedPassword = await bcryptjs.hash(password, salt);
        //create user
        const newUser = new User({ name, username, email, password: hashedPassword });
        //check if new user is saved
        if (newUser) {
            //generate token and set cookie
            generateTokenAndSetCookie(newUser._id, res);
            //save user
            await newUser.save();
            return res.status(201).json({
                success: true,
                message: "User Registered successfully",
                user: {
                    ...newUser._doc,
                    password: undefined
                }

            });


        } else {
            return res.status(400).json({ success: false, message: "User not created" });

        }

    } catch (error) {
        console.log("error in registering user controller", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", });


    }

}
//login user
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        //check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please provide username and password" });
        }

        //check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid username" });
        }
        //check if password is correct
        const isValidPassword = await bcryptjs.compare(password, user?.password || " ");//incase user.password is undefined
        if (!isValidPassword) {
            return res.status(400).json({success:false, message: "Invalid password" });
        }
        //generate token and set cookie
        generateTokenAndSetCookie(user._id, res);
        //send user details
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        console.log("error in login user controller", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", });

    }

}
//logout user
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", "", {maxAge: 0, });
        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
        
        
    } catch (error) {
        console.log("error in logout user controller", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", });
        
    }

}

//check if user is authenticated
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
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
        console.log("error in get user controller", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", });
        
    }
}
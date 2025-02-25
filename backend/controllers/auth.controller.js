import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const register = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        //check if email is email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}
        //check if email already exists
        const userExists = await UserActivation.findOne({email});
        if (userExists) {
            return res.status(400).json({ error: "Email already exists" });
        }
        //check if username already exists
        const usernameExists = await UserActivation.findOne({username});
        if (usernameExists) {
            return res.status(400).json({ error: "Username already exists" });
        }
        //check if password is atleast 6 characters long
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be atleast 6 characters long" });
        }
        //hash password
        const salt = await bcryptjs.genSalt(10);// 10 rounds of hashing
        const hashedPassword = await bcryptjs.hash(password, salt);
        //create user
        const newUser = new User({name, username, email, password: hashedPassword});
        //check if new user is saved
        if(newUser){
            //generate token and set cookie
            generateTokenAndSetCookie(newUser._id, res);
            //save user
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,

            });


        }else{
            return res.status(400).json({ error: "User notcreated" });

        }

    } catch (error) {
        console.log("error in registering user controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
        
        
    }
    
}
export const login = async (req, res) => {
    res.send("login");
    
}
export const logout = async (req, res) => {
    res.send("logout");
    
}
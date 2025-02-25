import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }
    ],
    profileImg: {
        type: String,
        default: '',
    },
    coverImg: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    link: {
        type: String,
        default: '',
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender Id is required"]
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver Id is required"]
    },
    text:{
        type: String,
        required: [true, "Message is required"]
    },
    
    
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
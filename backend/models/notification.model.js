import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "From is required"],
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "To is required"],
    },
    type: {
        type: String,
        required: [true, "Type is required"],
        enum: ["follow", "like"],
    },
    read: {
        type: Boolean,
        default: false,
    },




}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
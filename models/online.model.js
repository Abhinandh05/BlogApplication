import mongoose from "mongoose";


const onlineUserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const OnlineUser = mongoose.model("OnlineUser", onlineUserSchema);

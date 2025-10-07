import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   // null = global chat, filled = private chat
        default: null
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    senderName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Message = mongoose.model("Message", messageSchema);

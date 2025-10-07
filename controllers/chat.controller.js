import {Message} from "../models/message.model.js";
import {OnlineUser} from "../models/online.model.js"
import {User} from "../models/user.model.js";


export const getAllMessages = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        const messages = await Message.find({ receiver: null }) // only global
            .populate("sender", "username email avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalMessages = await Message.countDocuments({ receiver: null });

        res.status(200).json({
            success: true,
            messages: messages.reverse(),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages,
                hasNext: page * limit < totalMessages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getUserMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        })
            .populate("sender", "username email avatar")
            .populate("receiver", "username email avatar")
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Get user messages error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { content, receiverId } = req.body;
        const senderId = req.user._id;
        const senderName = req.user.username;

        if (!content?.trim()) {
            return res.status(400).json({ success: false, message: "Message content required" });
        }

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId || null,
            content: content.trim(),
            senderName
        });

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "username email avatar")
            .populate("receiver", "username email avatar");

        res.status(201).json({ success: true, message: populatedMessage });
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOnlineUsers = async (req, res) => {
    try {
        const onlineUsers = await OnlineUser.find()
            .populate("user", "username email avatar")
            .sort({ lastSeen: -1 });

        res.status(200).json({
            success: true,
            onlineUsers: onlineUsers.map(u => ({
                userId: u.user._id,
                username: u.user.username,
                avatar: u.user.avatar,
                lastSeen: u.lastSeen,
                socketId: u.socketId
            }))
        });
    } catch (error) {
        console.error("Get online users error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const setUserOnline = async (req, res) => {
    try {
        const { userId, username, socketId } = req.body;

        const onlineUser = await OnlineUser.findOneAndUpdate(
            { user: userId },
            { user: userId, username, socketId, lastSeen: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, onlineUser });
    } catch (error) {
        console.error("Set user online error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const setUserOffline = async (req, res) => {
    try {
        const { socketId } = req.body;
        await OnlineUser.findOneAndDelete({ socketId });
        res.status(200).json({ success: true, message: "User set offline" });
    } catch (error) {
        console.error("Set user offline error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllUsersWithStatus = async (req, res) => {
    try {
        const users = await User.find({}, "username email avatar");
        const onlineUsers = await OnlineUser.find();
        const onlineSet = new Set(onlineUsers.map(u => u.user.toString()));

        res.status(200).json({
            success: true,
            users: users.map(u => ({
                userId: u._id,
                username: u.username,
                avatar: u.avatar,
                isOnline: onlineSet.has(u._id.toString())
            }))
        });
    } catch (error) {
        console.error("Get users with status error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
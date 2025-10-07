import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import path from 'path';
import { createServer } from 'http';
import { Server } from "socket.io";

import connectDB from './config/db.js';
import userRoute from './routes/user.routes.js';
import postRoute from './routes/post.routes.js';
import commentRoute from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import messageRoute from "./routes/message.routes.js";

import { Message } from "./models/message.model.js";
import { OnlineUser } from "./models/online.model.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.use("/api/v1/user", userRoute);
app.use("/", postRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/message", messageRoute);

// Socket.IO events
io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // User comes online
    socket.on("userOnline", async ({ userId, username }) => {
        try {
            if (!userId || !username) return;

            await OnlineUser.findOneAndUpdate(
                { user: userId },
                { user: userId, username, socketId: socket.id, lastSeen: new Date() },
                { upsert: true, new: true }
            );

            const onlineUsers = await OnlineUser.find().populate("user", "username avatar");
            io.emit("onlineUsers", onlineUsers);
        } catch (err) {
            console.error("userOnline error:", err);
        }
    });

    // Send message
    socket.on("sendMessage", async ({ senderId, receiverId, content, senderName }) => {
        try {
            if (!senderId || !senderName || !content?.trim()) return;

            const message = await Message.create({
                sender: senderId,
                receiver: receiverId || null,
                content: content.trim(),
                senderName
            });

            const populatedMessage = await Message.findById(message._id)
                .populate("sender", "username email avatar")
                .populate("receiver", "username email avatar");

            if (receiverId) {
                const receiver = await OnlineUser.findOne({ user: receiverId });
                if (receiver) io.to(receiver.socketId).emit("newMessage", populatedMessage);
                socket.emit("newMessage", populatedMessage);
            } else {
                io.emit("newMessage", populatedMessage);
            }
        } catch (err) {
            console.error("sendMessage error:", err);
        }
    });

    // User disconnects
    socket.on("disconnect", async () => {
        try {
            console.log(`❌ User disconnected: ${socket.id}`);
            await OnlineUser.findOneAndDelete({ socketId: socket.id });
            const onlineUsers = await OnlineUser.find().populate("user", "username avatar");
            io.emit("onlineUsers", onlineUsers);
        } catch (err) {
            console.error("disconnect error:", err);
        }
    });
});

// Pages
app.get("/", async (req, res) => {
    const posts = await (await import('./models/post.model.js')).Post.find().sort({ createdAt: -1 });
    res.render("index", { user: req.user, posts });
});
app.get("/login", (req, res) => res.render("auth/login", { error: null }));
app.get("/signup", (req, res) => res.render("auth/signup", { error: null }));
app.get("/create", (req, res) => res.render("posts/createpost", { error: null }));
app.get("/admin", (req, res) => res.render("admin/dashboard", { error: null }));

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});

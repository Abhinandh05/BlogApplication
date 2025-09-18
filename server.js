import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import connectDB from './config/db.js'
import userRoute from './routes/user.routes.js'
import postRoute from  './routes/post.routes.js'
import commentRoute from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";


dotenv.config();

const app = express();


// middleware setting

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser());


app.set("view engine", "ejs");
app.set("views", "./views");

// api calls

app.use("/api/v1/user", userRoute);
app.use("/", postRoute);
app.use("/api/v1/comment", commentRoute)
app.use("/api/v1/admin", adminRoutes)







// setting up the port

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () =>{
    await connectDB();
    console.log(`The server is connected to the PORT ${PORT}`)

})

app.get("/", (_, res) => {
    res.render("index", { message: "API + EJS running successfully!" });
});
app.get("/login", (req, res) => {
    res.render("auth/login", { error: null });
});
app.get("/signup", (req, res) => {
    res.render("auth/signup", { error: null });
});
app.get("/create", (req, res) => {
    res.render("posts/createpost", { error: null });
});
app.get("/admin", (req, res) => {
    res.render("admin/dashboard", { error: null });
});



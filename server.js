import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import connectDB from './config/db.js'
import userRoute from './routes/user.routes.js'
import postRoute from  './routes/post.routes.js'

dotenv.config();

const app = express();


// middleware setting

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser());

// api calls

app.use("/api/v1/user", userRoute);
app.use("/api/v1/posts", postRoute);







// setting up the port

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () =>{
    await connectDB();
    console.log(`The server is connected to the PORT ${PORT}`)

})

app.get("/", (_,res) =>{
    res.send("Api is working correctly")
})


import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import connectDB from './config/db.js'

dotenv.config();

const app = express();


// middleware setting

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser());

// api calls







// setting up the port

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () =>{
    await connectDB();
    console.log(`The server is connected to the PORT ${PORT}`)

})

app.get("/", (_,res) =>{
    res.send("Api is working correctly")
})


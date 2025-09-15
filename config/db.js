import mongoose  from 'mongoose';

const connectDB = async () =>{
    try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("The mongoDB url is connected successfully")

    } catch (error){
        console.log("something went to wrong please check the connection", error)
    }
}

export default connectDB;

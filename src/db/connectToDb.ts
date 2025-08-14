import mongoose from "mongoose";
let connectedToDb = false;
export const connectToDb = async()=>{
    try{
        if(connectedToDb) return;
        await mongoose.connect(process.env.MONGO_URI as string);
        connectedToDb = true;
        mongoose.connection.on("connected", ()=>{
            console.log("MongoDB connected successfully ")
        })
        mongoose.connection.on("error", (err)=>{
            console.error("MongoDB connection failed", err);
            process.exit();

        })

    }catch(error){
        console.error("internal error : ", error)
        throw new Error("failed to connect to mongodb")
    }
}
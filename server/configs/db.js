import mongoose from "mongoose";

const mongoConnect = async() => {
  try {
    const conn=await mongoose.connect(process.env.MONGO_URI + "/resumeBuilder")
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.log("Mongo connection failed",error);
    process.exit(1)
  }
};

export default mongoConnect;


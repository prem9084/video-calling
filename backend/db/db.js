import mongoose from "mongoose";

export const connectDb = async (req, res) => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database Connnected ${db.connection.host}`);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

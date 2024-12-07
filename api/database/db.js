import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/authDB");
    console.log("database is connected!");
  } catch (err) {
    console.log(err.message);
  }
};

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("database connected successfully!");
  } catch (error) {
    console.log("Database connection error :", error);
  }
};

module.exports = connectDB;

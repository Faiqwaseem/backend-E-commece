const mongoose = require("mongoose");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.log("Error connecting to database", error.massage);

    process.exit(1); // Meaning: Application ko stop karo
  }
}

module.exports = connectDB;

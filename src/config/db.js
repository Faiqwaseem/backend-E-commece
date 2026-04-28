const mongoose = require('mongoose');


async function connectDB() {

    try {
        
         const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");

    } 
    catch (error) {
        
        console.log("Error connecting to database", error);

    }

};

module.exports = connectDB;
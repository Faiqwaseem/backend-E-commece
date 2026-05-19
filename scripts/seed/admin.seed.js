// scripts/seed/admin.seed.js

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = require("../../src/models/user.model");

/*
|--------------------------------------------------------------------------
| DATABASE CONNECTION
|--------------------------------------------------------------------------
*/

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

/*
|--------------------------------------------------------------------------
| CREATE DEFAULT ADMIN
|--------------------------------------------------------------------------
*/

const seedAdmin = async () => {
  try {
    /*
    |--------------------------------------------------------------------------
    | CHECK EXISTING ADMIN
    |--------------------------------------------------------------------------
    */

    const existingAdmin = await userModel.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists");

      process.exit(0);
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE ADMIN
    |--------------------------------------------------------------------------
    */

    const admin = await userModel.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin seeded successfully");

    console.table([
      {
        ID: admin._id.toString(),
        Username: admin.username,
        Email: admin.email,
        Role: admin.role,
      },
    ]);

    process.exit(0);
  } catch (error) {
    console.error(" Admin seeding failed");

    console.error(error);

    process.exit(1);
  }
};

/*
|--------------------------------------------------------------------------
| RUN SEEDER
|--------------------------------------------------------------------------
*/

const runSeeder = async () => {
  console.log("\n Starting Admin Seeder...\n");

  await connectDB();

  await seedAdmin();
};

runSeeder();
import mongoose from "mongoose";
import User from "../models/user-model";
import dotenv from "dotenv";

dotenv.config();

const dummyUsers = [
    {
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        password: "password123",
    },
    {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        password: "password123",
    },
    {
        name: "Amit Kumar",
        email: "amit.kumar@example.com",
        password: "password123",
    },
    {
        name: "Sneha Reddy",
        email: "sneha.reddy@example.com",
        password: "password123",
    },
    {
        name: "Arjun Singh",
        email: "arjun.singh@example.com",
        password: "password123",
    },
    {
        name: "Ananya Iyer",
        email: "ananya.iyer@example.com",
        password: "password123",
    },
    {
        name: "Vikram Mehta",
        email: "vikram.mehta@example.com",
        password: "password123",
    },
    {
        name: "Kavya Nair",
        email: "kavya.nair@example.com",
        password: "password123",
    },
    {
        name: "Rohan Gupta",
        email: "rohan.gupta@example.com",
        password: "password123",
    },
    {
        name: "Divya Desai",
        email: "divya.desai@example.com",
        password: "password123",
    },
];

const seedUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to MongoDB");

        // Clear existing users (optional - comment out if you want to keep existing users)
        await User.deleteMany({});
        console.log("Cleared existing users");

        // Insert dummy users
        await User.insertMany(dummyUsers);
        console.log(`${dummyUsers.length} dummy users inserted successfully`);

        // Disconnect
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();

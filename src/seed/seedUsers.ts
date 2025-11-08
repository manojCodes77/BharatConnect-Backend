import mongoose from "mongoose";
import User from "../models/user-model";
import dotenv from "dotenv";

dotenv.config();

const dummyUsers = [
    {
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Amit Kumar",
        email: "amit.kumar@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Sneha Reddy",
        email: "sneha.reddy@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Arjun Singh",
        email: "arjun.singh@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Ananya Iyer",
        email: "ananya.iyer@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Vikram Mehta",
        email: "vikram.mehta@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Kavya Nair",
        email: "kavya.nair@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Rohan Gupta",
        email: "rohan.gupta@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
    },
    {
        name: "Divya Desai",
        email: "divya.desai@example.com",
        password: "$2b$10$1jWuFqUyOsQh8Qh8sX0jl.LSU8fZ.VsU.3EbtanTGPBzF7M.6QvMO",
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

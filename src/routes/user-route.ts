import { Router } from "express";
import User from "../models/user-model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.post('/sign-up', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' ,success: false});
        }
        // first check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' ,success: false});
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User signed up' ,success: true});
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).json({ message: 'Internal Server Error' ,success: false});
    }
});

router.post('/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' ,success: false});
        }
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' ,success: false});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET||"", { expiresIn: '1h' });
        res.json({ message: 'User signed in', token });
    } catch (error) {
        console.error("Error signing in user:", error);
        res.status(500).json({ message: 'Internal Server Error' ,success: false});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' ,success: false});
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: 'Internal Server Error' ,success: false});
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        if(!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' ,success: false});
        }
        res.json(users);
    } catch (error:any) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: 'Internal Server Error' ,success: false});
    }
});

export default router;
import { Router } from "express";

const router = Router();

router.post('/sign-up', (req, res) => {
    // Handle user sign-up
    res.send('User signed up');
});

router.post('/sign-in', (req, res) => {
    // Handle user sign-in
    res.send('User signed in');
});

export default router;
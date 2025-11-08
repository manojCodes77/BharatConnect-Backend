import { Router } from "express";

const router = Router();

router.post('/create', (req, res) => {
    // Handle post creation
    res.send('Post created');
});

router.get('/:id', (req, res) => {
    // Handle fetching a single post
    res.send('Post details');
});

router.get('/my-posts', (req, res) => {
    // Handle fetching posts of the logged-in user
    res.send('My posts');
});

export default router;

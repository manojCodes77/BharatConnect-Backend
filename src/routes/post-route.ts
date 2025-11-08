import { Request, Response, Router, RequestHandler } from "express";
import Post from "../models/post-model";
import { verifyToken } from "../middlewares/auth";

interface AuthRequest extends Request {
  user?: { id: string };
}

const router = Router();
router.use(verifyToken);

const createHandler: RequestHandler = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: "Title and content are required", success: false });
      return;
    }
    const newPost = new Post({ title, content });
    await newPost.save();
    res.status(201).json({ message: "Post created", success: true });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const myPostsHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id; // safe cast
    const posts = await Post.find({ author: userId });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const listHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const posts = await Post.find({ author: { $ne: userId } }).populate('authorId');
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const getByIdHandler: RequestHandler = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('authorId');
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

router.post("/create", createHandler);
router.get("/my-posts", myPostsHandler);
router.get("/", listHandler);
router.get("/:id", getByIdHandler);

export default router;

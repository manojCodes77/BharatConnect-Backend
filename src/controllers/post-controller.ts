import { Request, RequestHandler } from "express";
import Post from "../models/post-model";

interface AuthRequest extends Request {
  user?: { id: string };
}
export const createHandler: RequestHandler = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: "Title and content are required", success: false });
      return;
    }
    const authorId = (req as AuthRequest).user?.id;
    const newPost = new Post({ title, content, authorId });
    await newPost.save();
    res.status(201).json({ message: "Post created", success: true });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const myPostsHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id; // safe cast
    const posts = await Post.find({ authorId: userId });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const listHandler: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    console.log("Authenticated user ID:", userId);
    // all the post must sorted by updatedAt in descending order
    const posts = await Post.find({ authorId: { $ne: userId } }).populate('authorId').sort({ updatedAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getByIdHandler: RequestHandler = async (req, res) => {
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

export const UpdatePostByIdHandler: RequestHandler = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }
    post.title = title;
    post.content = content;
    await post.save();
    res.json({ message: "Post updated successfully", success: true });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const deletePostByIdHandler: RequestHandler = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

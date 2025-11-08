import { verifyToken } from "../middlewares/auth";
import { createHandler, deletePostByIdHandler, getByIdHandler, listHandler, myPostsHandler, UpdatePostByIdHandler, likePostHandler, commentPostHandler, savePostHandler, sharePostHandler } from "../controllers/post-controller";
import { Router } from "express";

const router = Router();

// Public routes (no auth required)
router.get("/", listHandler);
router.get("/:id", getByIdHandler);

// Protected routes (auth required)
router.post("/", verifyToken, createHandler);
router.get("/my-posts", verifyToken, myPostsHandler);
router.put("/:id", verifyToken, UpdatePostByIdHandler);
router.delete("/:id", verifyToken, deletePostByIdHandler);

// Interaction routes (auth required)
router.post("/:id/like", verifyToken, likePostHandler);
router.post("/:id/comment", verifyToken, commentPostHandler);
router.post("/:id/save", verifyToken, savePostHandler);
router.post("/:id/share", verifyToken, sharePostHandler);

export default router;
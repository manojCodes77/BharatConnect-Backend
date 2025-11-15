import { verifyToken } from "../middlewares/auth";
import { createHandler, deletePostByIdHandler, getByIdHandler, listHandler, myPostsHandler, UpdatePostByIdHandler, likePostHandler, commentPostHandler, savePostHandler, sharePostHandler, getSavedPostsHandler } from "../controllers/post-controller";
import { Router } from "express";
import upload from "../middlewares/upload";

const router = Router();

// Public routes (no auth required)
router.get("/", listHandler);

// Protected routes (auth required) - must come before /:id route
router.get("/my-posts", verifyToken, myPostsHandler);
router.get("/saved", verifyToken,getSavedPostsHandler);
router.post("/", verifyToken,upload.array('images', 5), createHandler);

// Public route with parameter (must come after specific routes)
router.get("/:id", getByIdHandler);

// Protected routes with parameters
router.put("/:id", verifyToken, upload.array('images', 5), UpdatePostByIdHandler);
router.delete("/:id", verifyToken, deletePostByIdHandler);

// Interaction routes (auth required)
router.post("/:id/like", verifyToken, likePostHandler);
router.post("/:id/comment", verifyToken, commentPostHandler);
router.post("/:id/save", verifyToken, savePostHandler);
router.post("/:id/share", verifyToken, sharePostHandler);

export default router;
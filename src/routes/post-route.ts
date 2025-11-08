import { verifyToken } from "../middlewares/auth";
import { createHandler, deletePostByIdHandler, getByIdHandler, listHandler, myPostsHandler, UpdatePostByIdHandler } from "../controllers/post-controller";
import { Router } from "express";

const router = Router();
router.use(verifyToken);

router.post("/", createHandler);
router.get("/", listHandler);
router.get("/my-posts", myPostsHandler);
router.get("/:id", getByIdHandler);
router.put("/:id", UpdatePostByIdHandler);
router.delete("/:id", deletePostByIdHandler);

export default router;
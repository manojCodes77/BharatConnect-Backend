import { verifyToken } from "../middlewares/auth";
import { createHandler, getByIdHandler, listHandler, myPostsHandler } from "../controllers/post-controller";
import { Router } from "express";

const router = Router();
router.use(verifyToken);

router.post("/create", createHandler);
router.get("/my-posts", myPostsHandler);
router.get("/", listHandler);
router.get("/:id", getByIdHandler);

export default router;
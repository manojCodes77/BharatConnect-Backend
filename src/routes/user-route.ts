import dotenv from "dotenv";
import { GetByIdHandler, signInHandler, signUpHandler } from "../controllers/user-controller";
import { listHandler } from "../controllers/post-controller";
import { Router } from "express";
dotenv.config();

const router = Router();


router.post('/sign-up', signUpHandler);
router.post('/sign-in', signInHandler);
router.get('/', listHandler);
router.get('/:id', GetByIdHandler);

export default router;
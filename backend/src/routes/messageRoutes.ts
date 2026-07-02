import { Router } from "express";
import * as messageController from "../controllers/messageController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// Every route in this file requires a valid JWT — applied once, for the whole router.
router.use(authMiddleware);

router.post("/", messageController.sendMessage);
router.get("/", messageController.getChatHistory);

export default router;

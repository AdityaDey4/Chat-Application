import express from "express";
import { getMessage, sendMessage, getConversationId } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);
router.route("/conversation/:id").get(isAuthenticated, getConversationId);

export default router;
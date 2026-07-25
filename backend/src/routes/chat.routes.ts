import { Router } from "express";
import { createChatReply } from "../services/chat.service.js";

const router = Router();

/**
 * POST /chat
 * Body: { "message": "hello" }

 */
router.post("/", async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string") {
      res.status(400).json({ error: "message must be a string" });
      return;
    }
  
    const reply = await createChatReply(message);
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }

});

export default router;

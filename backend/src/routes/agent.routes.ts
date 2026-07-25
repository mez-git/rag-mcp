import { Router } from "express";
import { runAgent } from "../services/agent.service.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const message = req.body?.message;
    if (typeof message !== "string") {
      res.status(400).json({ error: "message must be a string" });
      return;
    }
    const reply = await runAgent(message);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Agent failed" });
  }
});

export default router;
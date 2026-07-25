import { Router } from "express";
import { ingestText } from "../services/ingest.service.js";
const router = Router();

router.post("/", async (req, res) => {
    console.log("Ingesting text",req.body.text);
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    const result = await ingestText(text);
    res.status(200).json({ id: result });
  
});

export default router;

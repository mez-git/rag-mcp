import { Router } from "express";
import { pingChroma } from "../repositories/chroma.repository.js";
const router = Router();

router.get("/", async(_req, res) => {
    console.log("Pinging Chroma");
    const heartbeat = await pingChroma();
    console.log("Chroma pinged", heartbeat);
    res.json({ heartbeat });
});

export default router;
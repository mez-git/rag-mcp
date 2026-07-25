import { Router } from "express";
import healthRoutes from "./health.routes.js";
import chatRoutes from "./chat.routes.js";
import pingRoute from "./ping.routes.js";
import ingestRoutes from "./ingest.routes.js";
import mcpRoutes from "./mcp.routes.js";
import agentRoutes from "./agent.routes.js";
const router = Router();

router.use("/health", healthRoutes);
router.use("/chat", chatRoutes);
router.use("/mcp", mcpRoutes);
router.use("/ping", pingRoute);
router.use("/ingest", ingestRoutes);
router.use("/agent", agentRoutes);
export default router;

import { Router } from "express";
import { getGitHubMcpTools , callGitHubTool } from "../mcp/github.mcp.js";
 
const router = Router();

router.get("/", async (req, res) => {
    const tools = await getGitHubMcpTools();
    res.json(tools);
});
router.get("/me", async (_req, res) => {
    try {
      const result = await callGitHubTool("get_me");
      res.json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "MCP call failed" });
    }
  });
export default router;
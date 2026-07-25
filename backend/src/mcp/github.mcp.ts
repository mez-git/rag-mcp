import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { env } from "../config/env.js";

export function getClient() {
    return new MultiServerMCPClient({
        mcpServers: {
            github: {
                transport: "stdio",
                command: "docker",
                args: [
                    "run",
                    "-i",
                    "--rm",
                    "-e",
                    "GITHUB_PERSONAL_ACCESS_TOKEN",
                    "ghcr.io/github/github-mcp-server",
                ],
                env: {
                    GITHUB_PERSONAL_ACCESS_TOKEN: env.GITHUB_TOKEN ?? "",
                },
            }
        }
    })
}





export async function getGitHubMcpTools() {
    const client = getClient();
    const tools = await client.getTools();

    return tools.map(tool => tool.name);
}

export async function callGitHubTool(
    toolName: string,
    args: Record<string, unknown> = {}
  ) {
    const client = getClient();
    const tools = await client.getTools();
  
    const tool = tools.find((t) => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }
      
    return tool.invoke(args);
  }
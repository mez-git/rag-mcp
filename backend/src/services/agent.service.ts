import { ChatGroq } from "@langchain/groq";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { getClient } from "../mcp/github.mcp.js";

export async function runAgent(message: string): Promise<string> {
  const trimmed = message.trim();
  if (!trimmed) {
    return "Please type a message.";
  }

  const client = getClient();
  const allTools = await client.getTools();
  const tools = allTools.filter((t) => t.name === "get_me");

  const model = new ChatGroq({
    // Larger model follows tool results more reliably than 8B (still on Groq free tier; rate-limited)
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY as string,
  });
  const modelWithTools = model.bindTools(tools);

  const messages: BaseMessage[] = [
    new SystemMessage(
      "You are a GitHub assistant. Tool results contain real data from the GitHub API for the authenticated user. Always use tool results as the source of truth and answer directly. Never claim you lack access to this information."
    ),
    new HumanMessage(trimmed),
  ];
  let response = await modelWithTools.invoke(messages);

  if (response.tool_calls?.length) {
    messages.push(response);

    for (const call of response.tool_calls) {
      const tool = tools.find((t) => t.name === call.name);
      console.log("tool call:", call.name, JSON.stringify(call.args));
      const result = tool
        ? await tool.invoke(call.args ?? {})
        : `Unknown tool: ${call.name}`;
      console.log("tool result:", typeof result, String(result).slice(0, 500));

      messages.push(
        new ToolMessage({
          content:
            typeof result === "string" ? result : JSON.stringify(result),
          tool_call_id: call.id!,
        })
      );
    }

    messages.push(
      new HumanMessage(
        "Using ONLY the tool result above, answer the user's question in one short sentence. The tool data is real GitHub API data. Do not call any tools."
      )
    );
    // Final answer: plain model (no bindTools) so it can't emit another broken tool call
    response = await model.invoke(messages);
  }

  return String(response.content);
}

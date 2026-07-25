import {ChatGroq} from "@langchain/groq";
import {callGitHubTool} from "../mcp/github.mcp.js";


export async function runAgent(message:string): Promise<string> {
  const trimmed =message.trim();
  if(!trimmed) {
    return "Please type a message.";
  }
 
  const githubData =await callGitHubTool("get_me");


  const model = new ChatGroq({
    model: "llama-3.1-8b-instant" as const,
    apiKey: process.env.GROQ_API_KEY as string,
  });
   
 const prompt = `Use ONLY the context below to answer.
 The user asked: ${trimmed}

 here is data from github: ${typeof githubData === "string" ? githubData : JSON.stringify(githubData)}

 Answer the user's question using this data.
 Keep it short answer short.`;
 const response = await model.invoke(prompt);
 return response.content as string;


}

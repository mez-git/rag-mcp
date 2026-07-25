import { BackendStatus } from "@/components/BackendStatus";
import { ChatBox } from "@/components/ChatBox";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>GitHub AI Assistant</h1>
      <BackendStatus />
      <hr style={{ margin: "1.5rem 0" }} />
      <ChatBox />
    </main>
  );
}

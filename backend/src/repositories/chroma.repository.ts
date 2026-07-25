import {ChromaClient} from "chromadb";


export function getChromaClient() {
    return new ChromaClient({
        path: process.env.CHROMA_URL || "http://localhost:8000"
    });
}   

export async function pingChroma() {
    console.log("Getting Chroma client");
    const client = getChromaClient();
    console.log("Client got", client);
    const heartbeat = await client.heartbeat();
    console.log("Heartbeat got", heartbeat);
    return heartbeat
}

export async function getCollection () {
    const client = getChromaClient();
    return await client.getOrCreateCollection({
        name: process.env.CHROMA_COLLECTION || "github-assistant"
    });
}
export async function addDocument(input: {
    id: string;
    text: string;
    embedding: number[];
  }) {
    const collection = await getCollection();
    await collection.add({
      ids: [input.id],
      documents: [input.text],
      embeddings: [input.embedding],
    });
  }

  export async function searchSimilar(input: {
    embedding: number[];
    nResults?: number;
  }) {
    const collection = await getCollection();
    return collection.query({
      queryEmbeddings: [input.embedding],
      nResults: input.nResults ?? 3,
    });
  }
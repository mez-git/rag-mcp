import { randomUUID } from "crypto";

import { embedText } from "./embeddings.service.js";

import { addDocument } from "../repositories/chroma.repository.js";

export async function ingestText(text:string) {
    const trimmed =text.trim();
    if (!trimmed) {
        throw new Error("Text is empty");
    }
    const embedding =await embedText(trimmed);
    const id =randomUUID();

    await addDocument({id,text:trimmed,embedding});

    return id;
}
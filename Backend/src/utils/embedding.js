import { pipeline } from "@xenova/transformers";

let embedder;

export const initEmbedder = async () => {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
}

export const getEmbedding = async (text) => {
    await initEmbedder();
    const vector = await embedder(text);
    return vector[0][0]; // embedding array
}

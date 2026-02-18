import { File } from "../models/file.model.js";
import { getEmbedding } from "../utils/embedding.js";
import cosineSimilarity from "compute-cosine-similarity";

export const searchFiles = async (req, res) => {
    const { query } = req.body;
    const user = req.user;

    if (!query) return res.status(400).json({ success: false, message: "Query is required" });

    // Convert query to embedding
    const queryEmbedding = await getEmbedding(query);

    let files = await File.find();

    files.forEach(file => {
        if (file.embedding) {
            file.similarity = cosineSimilarity(queryEmbedding, file.embedding);
        } else {
            file.similarity = 0;
        }
    });

    // Sort by similarity
    files.sort((a, b) => b.similarity - a.similarity);

    // Optional: filter for students by branch/semester
    if (user.role === "student") {
        files = files.filter(f => f.branch === user.branch && f.semester === user.semester);
    }

    // Return top 10 results
    res.status(200).json({ success: true, results: files.slice(0, 10) });
}

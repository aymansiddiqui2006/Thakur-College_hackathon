import fs from "fs";
import pdfParse from "pdf-parse";
import pptxParser from "pptx-parser";

export const extractText = async (filePath, fileType) => {
    if (fileType === "application/pdf") {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        return data.text;
    } else if (fileType.includes("presentation")) {
        const data = await pptxParser.parse(filePath);
        return data.join(" "); // combine all slides
    } else {
        return ""; // skip unsupported file types
    }
}


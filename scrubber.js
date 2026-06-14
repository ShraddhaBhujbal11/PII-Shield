import { pipeline } from "@huggingface/transformers";

let nerPipeline;

/**
 * Singleton Pattern for AI Model
 * Optimized for memory by loading only once.
 */
async function getPipeline() {
    try {
        if (!nerPipeline) {
            console.log("Initializing Transformer Pipeline...");
            nerPipeline = await pipeline(
                "token-classification",
                "Xenova/bert-base-NER",
                { revision: 'main' } // Ensures we use the stable version
            );
        }
        return nerPipeline;
    } catch (error) {
        console.error("Critical Error: Failed to load AI model.", error);
        throw new Error("AI Engine Offline");
    }
}

/**
 * Advanced Scrubbing Engine
 * Includes Regex, AI Context, and Mapping for Re-hydration
 */
export const scrubText = async (text) => {
    if (!text || typeof text !== 'string') return "";

    const model = await getPipeline();

    // 1. Data Structure to store "Original -> Token" mapping
    // This allows us to "undo" the redaction later for authorized users.
    const piiMap = new Map();

    // 2. Optimized Regex Layer
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /\b\d{10}\b/g;

    let scrubbedText = text
        .replace(emailRegex, "[EMAIL_REDACTED]")
        .replace(phoneRegex, "[PHONE_REDACTED]");

    // 3. AI Execution with Performance Monitoring
    const startTime = performance.now();
    const entities = await model(scrubbedText);
    const endTime = performance.now();

    console.log(`AI Inference took: ${(endTime - startTime).toFixed(2)}ms`);

    // 4. Smart Name Aggregation
    const namesToRedact = new Set();
    entities.forEach(entity => {
        if (entity.entity.includes('PER')) {
            // Clean sub-word tokens (BERT handles words like 'Arjun' as 'Ar', '##jun')
            let cleanWord = entity.word.replace('##', '').trim();
            if (cleanWord.length > 1) namesToRedact.add(cleanWord);
        }
    });

    // 5. Secure Replacement Logic
    // Using a set and then sorting by length prevents 'partial redaction' bugs
    const sortedNames = Array.from(namesToRedact).sort((a, b) => b.length - a.length);

    sortedNames.forEach((name, index) => {
        const tokenId = `[NAME_${index + 1}]`;
        const nameRegex = new RegExp(`\\b${name}\\b`, 'gi');

        // Store for re-hydration (Interview Gold!)
        piiMap.set(tokenId, name);

        scrubbedText = scrubbedText.replace(nameRegex, tokenId);
    });

    // Return the cleaned text and the map for the database/frontend
    return { scrubbedText, piiMap: Object.fromEntries(piiMap) };
};
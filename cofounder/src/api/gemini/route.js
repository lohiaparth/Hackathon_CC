require(
    "dotenv"
).config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
console.debug(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);

async function getGeminiResponse(prompt) {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    try {
        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// Example usage
async function main() {
    const prompt = "What is the capital of France?";
    const response = await getGeminiResponse(prompt);
    console.log(response);
}

main();
const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("firebase-functions/logger");

// Securely access the API key via Cloud Secret Manager or Environment Variable
// COMMAND TO SET: firebase functions:secrets:set GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_FALLBACK_IF_MOCKING");

exports.voyaResponse = onRequest({ cors: true }, async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: "No message provided" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // SYSTEM PROMPT FOR VOYA
        const prompt = `
      You are Voya, a supportive and calming AI companion for a mental health app called Nivora. 
      Your tone is empathetic, non-judgmental, and hopeful. 
      Keep responses concise and helpful. 
      If a user expresses self-harm or severe crisis, gently remind them to use the 'Emergency' tab in the app or contact a professional.
      
      User Message: ${message}
      ${context ? `Conversation Context: ${context}` : ""}
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        logger.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to connect to Voya AI" });
    }
});

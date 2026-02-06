const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Hugging Face Configuration (Mistral is very stable and free)
const HF_TOKEN = (process.env.HF_TOKEN || '').trim().replace(/^["']|["']$/g, '');
const HF_MODEL = "meta-llama/Llama-3.2-3B-Instruct";

// Media Database
const mediaData = require('./media_data.json');

app.get('/media', (req, res) => {
    const { category } = req.query;
    if (category) {
        const filtered = mediaData.filter(m => m.category.toLowerCase() === category.toLowerCase());
        return res.json(filtered);
    }
    res.json(mediaData);
});

app.post('/voya-chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message || message === "") {
            return res.status(400).json({ error: 'No message provided' });
        }

        const systemPrompt = `You are Voya, an empathetic and supportive mental health companion for the Nivora app. 
        Detect if the user is talking about specifically:
        1. Ragging/Bullying -> Suggest "SpeakOut" (route: /moods/speak-out)
        2. Legal/Police issues -> Suggest "JusticeLink" (route: /moods/justice-link)
        3. Anxiety/Stress/Personal problems -> Suggest "MindCare" (route: /moods/mind-care)
        4. Online scams/Privacy -> Suggest "CyberGuard" (route: /moods/cyber-guard)

        IMPORTANT: ALWAYS respond in valid JSON format:
        {
          "text": "Your empathetic response here",
          "suggestion": { "label": "Button Label", "route": "route_path" } (or null if no match)
        }
        Keep the "text" 2-3 sentences max. Context: ${context || 'None'}.`;

        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    model: HF_MODEL,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: message }
                    ],
                    max_tokens: 300,
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                }),
            }
        );

        // Safety check for non-JSON responses (prevents the "Unexpected token N" crash)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            console.error('Non-JSON Error Response:', errorText);
            return res.status(response.status).json({
                error: 'Voya is currently unavailable (Inference Provider issue).',
                details: errorText.slice(0, 100)
            });
        }

        const result = await response.json();

        if (!response.ok) {
            console.error('Hugging Face Router Error:', result);
            return res.status(response.status).json({
                error: result.error?.message || 'Voya is resting.',
                details: result.error
            });
        }

        const rawText = result.choices?.[0]?.message?.content || "{}";
        let finalData;
        try {
            finalData = JSON.parse(rawText);
        } catch (e) {
            finalData = { text: rawText, suggestion: null };
        }

        res.json({
            text: finalData.text || "I'm here for you.",
            suggestion: finalData.suggestion || null
        });
    } catch (error) {
        console.error('--- VOYA SERVER ERROR ---');
        console.error(error);
        res.status(500).json({ error: 'Voya encountered a technical snag.' });
    }
});

app.get('/', (req, res) => {
    res.send('Nivora Alternative Backend (HF Router) is running.');
});

// IMPORTANT: Wrap the listen block so it only runs in non-serverless environments
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;

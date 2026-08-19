const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GenAI Keys & Providers
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
const HF_TOKEN = (process.env.HF_TOKEN || '').trim().replace(/^["']|["']$/g, '');
const HF_MODEL = "meta-llama/Llama-3.2-3B-Instruct";

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

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

// Intelligent Emotion & Multilingual Fallback Engine
function getIntelligentEmotionalResponse(message) {
    const text = (message || '').toLowerCase();
    
    // Check for Sinhala / Singlish
    const isSinhala = /[\u0D80-\u0DFF]/.test(message) || /(mahansi|dukai|bayayi|epawela|karadarayak|rag|salli|udaw|adanna|hitha|mata|oyata|monawada|kohomada|sthuthi)/i.test(text);
    // Check for Tamil / Tanglish
    const isTamil = /[\u0B80-\u0BFF]/.test(message) || /(kavalai|bayam|alugai|udavi|stress|kashtam|ragging|vanakkam|eppadi|nandri)/i.test(text);

    // 1. Anxiety / Stress / Burnout / Exhaustion
    if (/(stress|tired|exhaust|burnout|overwhelm|anxious|panic|relax|breath|mahansi|nidimatha|mahansiyi|pressure|kashtam|kavalai|fatigue|sleep)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "ඔබට දැනෙන මහන්සිය සහ පීඩනය මට තේරෙනවා. ජීවිතේ හැම මොහොතකම දුවන්න ඕනෙ නෑ, දැන් ටිකක් නිදහසේ හුස්මක් අරන් විවේක ගනිමු. ඔබ ගොඩක් ශක්තිමත් කෙනෙක්!",
                suggestion: { label: "MindCare", route: "/moods/mind-care" }
            };
        } else if (isTamil) {
            return {
                text: "உங்கள் சோர்வும் மன அழுத்தமும் எனக்குப் புரிகிறது. நீங்கள் தனியாக இல்லை. ஆழமாக சுவாசித்து அமைதி பெறுங்கள். நீங்கள் மிகவும் வலிமையானவர்!",
                suggestion: { label: "MindCare", route: "/moods/mind-care" }
            };
        }
        return {
            text: "I hear how exhausted and overwhelmed you are feeling right now. Remember, rest is not a weakness—it is how your spirit recharges. You are capable and worthy of a peaceful, vibrant life.",
            suggestion: { label: "MindCare", route: "/moods/mind-care" }
        };
    }

    // 2. Sadness / Grief / Loneliness / Heartbreak
    if (/(sad|cry|alone|lonely|heartbreak|depress|hopeless|hurt|dukai|adanna|thanikama|alugai|valikkuthu|pain|unhappy|broken)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "ඔබේ හිතේ තියෙන දුක සහ තනිකම මට තේරෙනවා. අඳුරු රැයකට පස්සෙ ලස්සන හිරු උදාවක් එනවා වගේ ඔබේ ජීවිතෙත් ආයෙත් බලාපොරොත්තුවෙන් පිරෙයි. මම ඔබ ළඟින්ම ඉන්නවා.",
                suggestion: { label: "SafeHaven", route: "/moods/sad" }
            };
        } else if (isTamil) {
            return {
                text: "உங்கள் வேதனையையும் தனிமையையும் நான் உணர்கிறேன். கவலைப்படாதீர்கள், இந்த இருள் நீங்கி உங்கள் வாழ்வில் புது வெளிச்சம் பிறக்கும். நான் எப்போதும் உங்களுடன் இருக்கிறேன்.",
                suggestion: { label: "SafeHaven", route: "/moods/sad" }
            };
        }
        return {
            text: "I can feel the heavy weight you are carrying. Even on the darkest days, please remember your story is not over, and joy will find you again. I am right here listening to you.",
            suggestion: { label: "SafeHaven", route: "/moods/sad" }
        };
    }

    // 3. Bullying / Ragging / Incident Support
    if (/(rag|ragging|bully|harass|threat|campus|senior|scared|baya|bayai|bayam|fear)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "කිසිම කෙනෙකුට ඔබව බියවද්දන්න හෝ හිංසා කරන්න අයිතියක් නෑ. ඔබ තනිවෙලා නෑ, මේ ගැන කතා කරන්න සහ ආරක්ෂාව ගන්න අපිට පුළුවන්.",
                suggestion: { label: "SpeakOut", route: "/moods/speak-out" }
            };
        } else if (isTamil) {
            return {
                text: "யாரும் உங்களை மிரட்டவோ அல்லது துன்புறுத்தவோ உரிமை இல்லை. உங்கள் பாதுகாப்பிற்கு நாங்கள் துணையாக இருக்கிறோம். தயங்காமல் பேசுங்கள்.",
                suggestion: { label: "SpeakOut", route: "/moods/speak-out" }
            };
        }
        return {
            text: "No one has the right to intimidate, bully, or hurt you. You are brave, and you do not have to suffer in silence. Let's take action together.",
            suggestion: { label: "SpeakOut", route: "/moods/speak-out" }
        };
    }

    // 4. Online Scams / Cyber Harassment
    if (/(hack|scam|online|nude|photo|leak|password|whatsapp|facebook|cyber|salli|threat|blackmail)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "ඩිජිටල් තර්ජන හෝ වංචාවන් නිසා බය වෙන්න එපා. ඔබේ ඩිජිටල් ආරක්ෂාව තහවුරු කරගන්න අපි උදව් කරන්නම්.",
                suggestion: { label: "CyberGuard", route: "/moods/cyber-guard" }
            };
        }
        return {
            text: "Your privacy and digital safety are top priorities. Do not panic—there are clear steps to protect yourself and block threats immediately.",
            suggestion: { label: "CyberGuard", route: "/moods/cyber-guard" }
        };
    }

    // 5. Legal / Rights Violation
    if (/(law|legal|court|police|rights|lawyer|case|complaint|neethi)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "ඔබේ අයිතිවාසිකම් සහ නීතිමය සහාය ලබාගැනීමට ඔබට සම්පූර්ණ අයිතියක් තියෙනවා. සාධාරණය වෙනුවෙන් පියවර ගනිමු.",
                suggestion: { label: "JusticeLink", route: "/moods/justice-link" }
            };
        }
        return {
            text: "You have legal rights and formal support channels available to you. Let's explore the right legal guidance and protect your rights.",
            suggestion: { label: "JusticeLink", route: "/moods/justice-link" }
        };
    }

    // General Empathetic Greeting / Motivation
    if (isSinhala) {
        return {
            text: "මම වෝයා (Voya), ඔබව ඇහුම්කන් දෙන්න සහ ඔබේ හිතට අලුත් ශක්තියක් දෙන්න මම මෙතන ඉන්නවා. අද ඔබේ හිතට කොහොමද දැනෙන්නේ?",
            suggestion: null
        };
    } else if (isTamil) {
        return {
            text: "வணக்கம்! நான் வோයා (Voya), உங்கள் மனதை அமைதிப்படுத்தவும் புது உற்சாகம் தரவும் நான் இருக்கிறேன். இன்று உங்கள் மனம் எப்படி உணர்கிறது?",
            suggestion: null
        };
    }

    return {
        text: "I'm Voya, and I'm right here with you with an open heart. Whatever you're going through, you have the power to create a beautiful, fulfilling life. Tell me, how are you feeling inside today?",
        suggestion: null
    };
}

// Voya Chat Endpoint with Gemini Primary & HF Fallback
app.post('/voya-chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message || message === "") {
            return res.status(400).json({ error: 'No message provided' });
        }

        const systemPrompt = `You are Voya, the Virtual Counseling Receptionist and Triage Guide for Nivora — a comprehensive mental health, campus safety, legal support, and digital wellness platform.

YOUR IDENTITY & RECEPTIONIST PERSONA:
1. Warm, Friendly & Professional: You represent the welcoming front desk of a sanctuary for the mind. Balance heartfelt warmth and empathy with calm, dignified professionalism and respect.
2. Active Listening & Triage: Validate the user's emotional state with genuine care. Help them understand what they are experiencing and gently offer practical next steps within Nivora.
3. Multilingual Etiquette: Respond in the exact language or mix the user uses (English, Sinhala/Singlish, Tamil/Tanglish) using courteous, respectful, and comforting vocabulary.
4. Expressive & Tasteful Emojis: Naturally include subtle, calming emojis (e.g., 🌿, 🌸, 🤍, ✨, 🕊️, 🤝) to keep the interaction warm and reassuring.
5. Strict Ethical Boundaries: Do not diagnose psychiatric conditions or prescribe medication. Provide emotional first-aid and route them to professional services.

RESPONSE FORMAT:
Respond directly in 2 to 3 concise, comforting, and professionally supportive sentences. Do not wrap in JSON or code blocks.
Context: ${context || 'None'}.`;

        // 1. Try Ultra-Fast Modern Gemini Models
        if (genAI) {
            const candidateModels = [
                process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
                "gemini-3.5-flash-lite",
                "gemini-3.5-flash"
            ];
            
            for (const modelName of candidateModels) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: {
                            temperature: 0.7,
                            topP: 0.9,
                        }
                    });

                    // 8-second timeout per model
                    const generatePromise = model.generateContent(`${systemPrompt}\nUser Message: ${message}`);
                    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Generation timeout')), 8000));

                    const result = await Promise.race([generatePromise, timeoutPromise]);
                    const responseText = (result.response.text() || "").trim();
                    
                    let parsedText = responseText;
                    let suggestion = null;

                    // Clean any markdown if model generated it
                    if (parsedText.startsWith('```')) {
                        parsedText = parsedText.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '').trim();
                        try {
                            const parsed = JSON.parse(parsedText);
                            if (parsed.text) parsedText = parsed.text;
                            if (parsed.suggestion) suggestion = parsed.suggestion;
                        } catch (_) {}
                    }

                    // Auto-detect relevant Nivora feature suggestion
                    if (!suggestion) {
                        const lowerMsg = (message + " " + parsedText).toLowerCase();
                        if (/(counselor|therapist|psychologist|doctor|appointment|human|talk to someone|counselling|session)/i.test(lowerMsg)) {
                            suggestion = { label: "Professional Counselor", route: "/moods/counselor-chat" };
                        } else if (/(mind-care|mindcare|stress|breath|anxious|tired|burnout|mahansi|kavalai|nidimatha|relax|panic)/i.test(lowerMsg)) {
                            suggestion = { label: "MindCare", route: "/moods/mind-care" };
                        } else if (/(sad|safehaven|cry|depress|heartbreak|grief|dukai|alugai|alone|thanikama|lonely|hurt)/i.test(lowerMsg)) {
                            suggestion = { label: "SafeHaven", route: "/moods/sad" };
                        } else if (/(rag|ragging|speakout|bully|harass|baya|bayayi|threat|campus|senior)/i.test(lowerMsg)) {
                            suggestion = { label: "SpeakOut", route: "/moods/speak-out" };
                        } else if (/(scam|cyberguard|cyber|hack|leak|photo|password|blackmail|online)/i.test(lowerMsg)) {
                            suggestion = { label: "CyberGuard", route: "/moods/cyber-guard" };
                        } else if (/(law|justicelink|legal|rights|court|police|neethi|complaint)/i.test(lowerMsg)) {
                            suggestion = { label: "JusticeLink", route: "/moods/justice-link" };
                        }
                    }

                    return res.json({
                        text: parsedText || "Welcome to Nivora. I am here to support you.",
                        suggestion: suggestion || null
                    });
                } catch (geminiError) {
                    console.warn(`Fast Gemini Model ${modelName} fallback:`, geminiError.message);
                }
            }
        }

        // 2. Fallback to Hugging Face Llama 3.2
        if (HF_TOKEN) {
            try {
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

                if (response.ok) {
                    const result = await response.json();
                    const rawText = result.choices?.[0]?.message?.content || "{}";
                    let finalData;
                    try {
                        finalData = JSON.parse(rawText);
                    } catch (e) {
                        finalData = { text: rawText, suggestion: null };
                    }
                    return res.json({
                        text: finalData.text || "I'm here to listen.",
                        suggestion: finalData.suggestion || null
                    });
                }
            } catch (hfError) {
                console.warn('HF Fallback Error:', hfError.message);
            }
        }

        // 3. Intelligent Multilingual Emotion & Motivation Engine (Offline Fallback)
        const fallbackResponse = getIntelligentEmotionalResponse(message);
        return res.json(fallbackResponse);

    } catch (error) {
        console.error('--- VOYA SERVER ERROR ---', error);
        res.status(500).json({ error: 'Voya encountered a technical snag.' });
    }
});

// Gen AI Dynamic Meditation Script Generator
app.post('/genai-meditation', async (req, res) => {
    try {
        const { mood, userFocus } = req.body;
        const prompt = `You are a calm, gentle mindfulness guide for the Nivora app. 
Generate a 3-step personalized grounding exercise for someone feeling ${mood || 'anxious'} (Focus area: ${userFocus || 'general calm'}).
Return JSON:
{
  "title": "Short Calming Title",
  "steps": ["Step 1 instructions", "Step 2 instructions", "Step 3 instructions"],
  "affirmation": "One positive soothing sentence"
}`;

        if (genAI) {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            const result = await model.generateContent(prompt);
            return res.json(JSON.parse(result.response.text()));
        }

        // Fallback
        res.json({
            title: `Grounding for ${mood || 'Calm'}`,
            steps: [
                "Place your hand gently over your chest and feel your heartbeat.",
                "Inhale slowly for 4 seconds, hold for 4 seconds, exhale for 6 seconds.",
                "Notice 3 things around you that bring a feeling of safety."
            ],
            affirmation: "You are safe in this moment."
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate meditation script" });
    }
});

// Gen AI Journal Insight Analyzer
app.post('/genai-journal-insight', async (req, res) => {
    try {
        const { journalEntries } = req.body;
        const prompt = `Analyze these anonymous journal snippets: "${(journalEntries || []).slice(0, 3).join(' | ')}"
Provide an empathetic 2-sentence encouraging summary and 1 reflection question.
Return JSON: { "insight": "2 sentences", "reflectionQuestion": "Question?" }`;

        if (genAI) {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            const result = await model.generateContent(prompt);
            return res.json(JSON.parse(result.response.text()));
        }

        res.json({
            insight: "You've been showing great emotional self-awareness. Taking time to process your thoughts is a big step in your healing journey.",
            reflectionQuestion: "What is one small thing that made you feel peaceful today?"
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate journal insight" });
    }
});

app.get('/', (req, res) => {
    res.send('Nivora Multi-Provider Gen AI Backend is running.');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;


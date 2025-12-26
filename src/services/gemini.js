const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt) {
    const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        })
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
}

export async function generateInterviewQuestions(topic, difficulty, count = 5) {
    try {
        const prompt = `
Generate ${count} interview questions on "${topic}".
Difficulty: ${difficulty}.
Return ONLY a JSON array of strings.
`;

        const text = await callGemini(prompt);
        const match = text.match(/\[[\s\S]*\]/);
        return JSON.parse(match[0]);
    } catch (e) {
        return [`Failed to generate questions: ${e.message}`];
    }
}

export async function generateInterviewFeedback(question, answer) {
    try {
        const prompt = `
Question: "${question}"
Answer: "${answer}"

You are a supportive interviewer. Evaluate the answer.
IMPORTANT: Always provide at least 1-2 strengths, even if they are minor (e.g., "Clear voice", "Good attempt", "Confident tone"), do NOT leave strengths empty.

Return JSON:
{
  "score": 0-100,
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "detailedFeedback": "..."
}
`;

        const text = await callGemini(prompt);
        const match = text.match(/\{[\s\S]*\}/);
        return JSON.parse(match[0]);
    } catch {
        return {
            score: 0,
            strengths: ["Attempted to answer"],
            improvements: ["Please try again"],
            detailedFeedback: "Could not generate detailed feedback."
        };
    }
}

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { currentTopic } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
            You are a creative content strategist for newsletters.
            Suggest 5 unique, trending, or highly engaging newsletter topic ideas based on the current context: "${currentTopic || 'General Technology and Business trends'}".
            
            Guidelines:
            - If the current context is specific, expand on it with interesting angles.
            - If it's empty, suggest broadly popular tech/lifestyle/business topics.
            - Focus on "click-worthy" hooks.
            
            Return the suggestions as a JSON object with a key "suggestions" which is an array of 5 strings.
            Example: {"suggestions": ["Topic 1", "Topic 2", ...]}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const parsed = JSON.parse(text);
            return NextResponse.json({
                suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : (Array.isArray(parsed) ? parsed : [])
            });
        } catch (e) {
            console.error("JSON Parse Error:", text);
            // Fallback: search for something that looks like an array in the text
            const match = text.match(/\[[\s\S]*\]/);
            if (match) {
                const fallbackParsed = JSON.parse(match[0]);
                return NextResponse.json({ suggestions: fallbackParsed });
            }
            return NextResponse.json({ suggestions: [] });
        }

    } catch (error: any) {
        console.error("Suggestion error:", error);
        return NextResponse.json({ error: "Failed to suggest topics", details: error.message }, { status: 500 });
    }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";




export async function POST(req: Request) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from environment variables");
        return NextResponse.json({ error: "Server Configuration Error: API Key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const { topic, layout = 'Standard', tone = 'Professional', theme = 'Modern' } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // List of models to try in order of preference (Working model found!)
        const modelsToTry = ["gemini-2.5-flash-lite", "gemini-flash-latest"];


        let lastError = null;

        const prompt = `
          You are an expert newsletter curator and professional writer. 
          Create a high-quality, engaging newsletter about: "${topic}".
          
          ADHERE TO THESE SPECIFIC PARAMETERS:
          - TONE: Use a ${tone} tone. Ensure the vocabulary and sentence structure match this style perfectly.
          - LAYOUT STYLE: Follow a ${layout} structure. 
            (Standard = balanced, Minimalist = concise/short, Research = data-heavy/detailed, Storytelling = narrative-driven).
          - VISUAL THEME CONTEXT: The app's theme is ${theme}. Use words or analogies that subtly evoke this feeling where appropriate.

          FORMATTING REQUIREMENTS (Markdown):
          1. A catchy H1 Headline.
          2. A brief, engaging introduction.
          3. 3-4 key sections or bullet points with valuable insights.
          4. A concluding thought.
          5. A clear "Call to Action" (CTA).
          
          DO NOT include any metadata or self-references like "Here is your newsletter". Just the newsletter content.
        `;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                if (text) {
                    return NextResponse.json({ content: text });
                }
            } catch (err: any) {
                console.warn(`Failed with model ${modelName}:`, err.message);
                lastError = err;
                continue; // Try next model
            }
        }

        throw lastError || new Error("All models failed to generate content");

    } catch (error: any) {
        console.error("Final Generation error:", error);
        return NextResponse.json({
            error: error.message || "Failed to generate newsletter after multiple attempts"
        }, { status: 500 });
    }
}


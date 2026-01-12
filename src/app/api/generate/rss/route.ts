import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Parser from "rss-parser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const parser = new Parser();

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { feedIds, layout, tone, theme } = await req.json();

        if (!feedIds || !Array.isArray(feedIds) || feedIds.length === 0) {
            return NextResponse.json({ error: "At least one feed must be selected" }, { status: 400 });
        }

        // @ts-ignore
        const modelKeys = Object.keys(prisma).filter(k => !k.startsWith('$'));
        const rssKey = modelKeys.find(k => k.toLowerCase() === 'rssfeed');
        const rssModel = rssKey ? (prisma as any)[rssKey] : null;

        if (!rssModel) {
            return NextResponse.json({ error: "Database model 'rssFeed' not found" }, { status: 500 });
        }

        const feeds = await rssModel.findMany({
            where: {
                id: { in: feedIds },
                user: { email: session.user.email }
            }
        });

        if (feeds.length === 0) {
            return NextResponse.json({ error: "No valid feeds found" }, { status: 404 });
        }

        // Fetch items from all selected feeds
        let allArticles: any[] = [];
        for (const feed of feeds) {
            try {

                const data = await parser.parseURL(feed.url);


                const items = (data.items || []).slice(0, 5).map(item => ({
                    title: item.title || "Untitled Article",
                    link: item.link || "#",
                    content: item.contentSnippet || item.content || item.summary || "No description available.",
                    pubDate: item.pubDate,
                    source: feed.name
                }));
                allArticles = [...allArticles, ...items];
            } catch (e: any) {
                console.error(`Failed to parse feed ${feed.name}:`, e.message);
            }
        }

        if (allArticles.length === 0) {
            return NextResponse.json({
                error: "No articles found in selected feeds",
                details: "We were able to connect to the feeds but they didn't return any readable articles at this time."
            }, { status: 400 });
        }

        const articlesContext = allArticles.map(a =>
            `Title: ${a.title}\nSource: ${a.source}\nSummary: ${a.content}\nLink: ${a.link}`
        ).join("\n\n---\n\n");

        const prompt = `
            You are an expert newsletter curator. Your task is to create a high-quality, engaging newsletter based on the following curated articles from various RSS feeds.

            Curation Rules:
            1. Use the "${tone}" tone.
            2. Follow a "${layout}" layout style.
            3. Group related articles if possible.
            4. Include a catchy main title for the newsletter.
            5. For each article, provide a brief, engaging summary and keep the original link.
            6. The theme is "${theme}", so adjust the vocabulary and style accordingly.
            7. Format everything in clean Markdown.
            8. If I provided many articles, select the most interesting ones (max 8).

            Articles:
            ${articlesContext}
        `;

        // Prepare prompt and model with fallback
        let result;
        // Updated with discovered working model names
        const modelNames = ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-flash-latest"];
        let lastError = null;



        for (const modelName of modelNames) {
            try {

                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(prompt);
                const response = await result.response;
                if (response.text()) break;
            } catch (e: any) {
                console.error(`Model ${modelName} failed:`, e.message);
                lastError = e;
            }
        }

        if (!result) {
            console.error("All AI models failed. Last error details:", lastError);
            return NextResponse.json({
                error: "AI Generation Failed",
                details: lastError?.message || "All models returned empty results",
                availableModels: modelNames
            }, { status: 500 });
        }

        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });

    } catch (error: any) {
        console.error("RSS Generation error full:", error);
        return NextResponse.json({
            error: "Failed to generate newsletter from RSS",
            details: error?.message || "Unknown error",
            stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
        }, { status: 500 });
    }
}

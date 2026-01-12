const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testFullGeneration() {
    const apiKey = 'AIzaSyA-pbHdtqO01KUgi2Rdeot0ejrJJrpisUk';
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = "gemini-2.5-flash-lite";

    const topic = "The Future of AI";
    const tone = "Professional";
    const layout = "Standard";
    const theme = "Modern";

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

    console.log(`Testing FULL generation with ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("SUCCESS! Content length:", text.length);
        console.log("Preview:\n", text.substring(0, 200));
    } catch (e) {
        console.log(`FAILED: ${e.message}`);
    }
}

testFullGeneration();

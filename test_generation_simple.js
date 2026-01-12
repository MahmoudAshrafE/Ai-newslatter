const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModels() {
    const apiKey = 'AIzaSyA-pbHdtqO01KUgi2Rdeot0ejrJJrpisUk'; // Hardcoded for test
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-2.0-flash-lite",
        "gemini-flash-latest",
        "gemini-2.0-flash",
        "gemini-2.5-flash"
    ];

    console.log("Testing Generation with various models...");

    for (const modelName of modelsToTest) {
        try {
            console.log(`\n--- Testing ${modelName} ---`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = "Suggest 1 newsletter topic.";
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`SUCCESS: ${text.substring(0, 50)}...`);
        } catch (e) {
            console.log(`FAILED: ${e.message}`);
        }
    }
}

testModels();

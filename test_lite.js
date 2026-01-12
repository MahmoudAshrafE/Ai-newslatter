const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testLite() {
    const apiKey = 'AIzaSyA-pbHdtqO01KUgi2Rdeot0ejrJJrpisUk';
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = "gemini-2.0-flash-lite";

    console.log(`Testing ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("hello");
        console.log(`SUCCESS: ${result.response.text()}`);
    } catch (e) {
        console.log(`FAILED: ${e.message}`);
    }
}

testLite();

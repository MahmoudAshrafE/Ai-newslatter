const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listAll() {
    const genAI = new GoogleGenerativeAI('AIzaSyA-pbHdtqO01KUgi2Rdeot0ejrJJrpisUk');
    // Attempting to fetch models via a known endpoint if possible or just try common ones
    // Actually, the easiest way to see what works is to try a very old name
    const models = ["gemini-pro", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"];

    for (const name of models) {
        try {
            const model = genAI.getGenerativeModel({ model: name });
            const result = await model.generateContent("hi");
            console.log(`${name}: SUCCESS`);
        } catch (e) {
            console.log(`${name}: FAIL - ${e.message}`);
        }
    }
}

listAll();

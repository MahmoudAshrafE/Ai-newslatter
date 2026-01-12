const { GoogleGenerativeAI } = require("@google/generative-ai");

async function findWorkingModel() {
    const apiKey = 'AIzaSyA-pbHdtqO01KUgi2Rdeot0ejrJJrpisUk';
    const genAI = new GoogleGenerativeAI(apiKey);

    const candidates = [
        "gemini-2.0-flash-lite-preview-02-05",
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash-preview-09-2025",
        "gemini-exp-1206",
        "gemma-3-4b-it", // Sometimes gemma is open via API? Unlikely but worth a shot if in list
        "gemini-flash-latest" // Retry just in case
    ];

    for (const m of candidates) {
        console.log(`Trying ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("hi");
            console.log(`>>> FOUND WORKING MODEL: ${m} <<<`);
            return;
        } catch (e) {
            console.log(`Failed ${m}: ${e.message.substring(0, 100)}`);
        }
    }
    console.log("No working models found.");
}

findWorkingModel();

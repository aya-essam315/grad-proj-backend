import { GoogleGenerativeAI } from "@google/generative-ai";
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

export const chatBotService= async(prompt)=>{
    
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([prompt]);
    return result;

}

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY});

// async function main() {
//   const response = await ai.models.generateContentStream({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works",
//   });

//   for await (const chunk of response) {
//     console.log(chunk.text);
//   }
// }

// await main();
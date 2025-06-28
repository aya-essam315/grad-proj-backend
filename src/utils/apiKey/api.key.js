import { GoogleGenerativeAI } from "@google/generative-ai";
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

export const chatBotService = async (prompt) => {
  const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent([prompt]);
  return result;
};

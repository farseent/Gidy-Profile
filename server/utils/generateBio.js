import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize ONCE outside the function to save resources
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateAIBio = async ({
  name,
  title,
  location,
  skills = [],
  experience = [],
  careerGoals,
}) => {
  try {
    const skillsList = skills.length ? skills.join(", ") : "Not specified";
    const expList = experience.length
      ? experience.map((e) => `${e.title} at ${e.company}`).join("; ")
      : "None yet";

    const prompt = `Write a concise, professional 2-3 sentence bio for a profile page... (rest of your prompt)`;

    // 2. Add a timeout or check if the API is responsive
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    // 3. Graceful Error Handling
    console.error("[generateAIBio Error]:", error.message);

    if (error.status === 429) {
      throw new Error("AI service is currently busy. Please try again in a minute.");
    }
    
    throw new Error("Failed to generate bio. Please fill it in manually for now.");
  }
};
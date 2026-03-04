import Groq from "groq-sdk";

/**
 * Generates a professional bio using Groq (free) based on profile data.
 */
export const generateAIBio = async ({
  name,
  title,
  location,
  skills = [],
  experience = [],
  careerGoals,
}) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const skillsList = skills.length ? skills.join(", ") : "Not specified";
  const expList    = experience.length
    ? experience.map((e) => `${e.title} at ${e.company}`).join("; ")
    : "None yet";

  const prompt = `Write a concise, professional 2-3 sentence bio for a profile page.
Person: ${name || "Professional"}
Title: ${title || "Professional"}
Location: ${location || ""}
Skills: ${skillsList}
Experience: ${expList}
Career Goals: ${careerGoals || "Not specified"}

Guidelines:
- First person voice ("I am...")
- Enthusiastic but professional tone
- Highlight key skills and experience
- Mention career aspirations if goals are provided
- Keep it under 60 words
- Return ONLY the bio text, no labels or quotes`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content.trim();
};
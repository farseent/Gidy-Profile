import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Generates a professional bio using Claude AI based on profile data.
 * @param {Object} profileData - { name, title, location, skills, experience, careerGoals }
 * @returns {Promise<string>} AI-generated bio
 */
export const generateAIBio = async ({ name, title, location, skills, experience, careerGoals }) => {
  const skillsList = skills.join(", ");
  const expList = experience.map((e) => `${e.title} at ${e.company}`).join("; ");

  const prompt = `Write a concise, professional 2-3 sentence bio for a profile page.

Person: ${name}
Title: ${title || "Professional"}
Location: ${location || ""}
Skills: ${skillsList}
Experience: ${expList || "None yet"}
Career Goals: ${careerGoals || "Not specified"}

Guidelines:
- First person voice ("I am...")
- Enthusiastic but professional tone
- Highlight key skills and experience
- Mention career aspirations if goals are provided
- Keep it under 60 words
- Return ONLY the bio text, no labels or quotes`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].text.trim();
};
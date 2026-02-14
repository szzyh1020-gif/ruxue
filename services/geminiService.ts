import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Enhance or write section content
export const generateSectionContent = async (title: string, currentContent: string, promptType: 'expand' | 'polish' | 'new'): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key missing.";

  let prompt = "";
  if (promptType === 'new') {
    prompt = `You are a helpful assistant for the Youth League Committee of Inner Mongolia University. Write a comprehensive, welcoming, and informative guide section for college freshmen (Class of 2026).
    Topic: "${title}".
    Tone: Encouraging, informative, formal yet warm.
    Format: Markdown.`;
  } else if (promptType === 'expand') {
    prompt = `You are an editor for Inner Mongolia University's freshman guide. Expand the following content to be more detailed and helpful for new students. Keep the original meaning but add practical tips.
    Current Content: "${currentContent}"
    Format: Markdown.`;
  } else {
    prompt = `You are an editor for Inner Mongolia University's freshman guide. Polish the following content to fix grammar, improve flow, and make it sound more professional.
    Current Content: "${currentContent}"
    Format: Markdown.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "Failed to generate content. Please try again.";
  }
};

// Answer student questions
export const answerStudentQuestion = async (question: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key missing.";

  const prompt = `You are a senior student mentor at Inner Mongolia University. Answer the following question from a freshman concisely and helpfully.
  Question: "${question}"
  Context: Inner Mongolia University (IMU), Huhehaote.
  Tone: Friendly, helpful senior (Xuechang/Xuejie).
  Language: Chinese.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini answering error:", error);
    return "抱歉，AI暂时无法回答，请等待人工回复。";
  }
};
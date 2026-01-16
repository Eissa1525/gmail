
import { GoogleGenAI } from "@google/genai";
import { EmailMessage, AppSettings } from "../types";

export const generateSmartReply = async (
  email: EmailMessage, 
  settings: AppSettings
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: settings.model,
      contents: `Draft a professional reply to this email:
      From: ${email.sender}
      Subject: ${email.subject}
      Content: ${email.body}`,
      config: {
        systemInstruction: settings.systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate reply.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const summarizeEmail = async (
  email: EmailMessage,
  settings: AppSettings
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: settings.model,
      contents: `Summarize this email in one short sentence:
      Subject: ${email.subject}
      Content: ${email.body}`,
      config: {
        systemInstruction: "You are a helpful assistant providing quick summaries.",
        maxOutputTokens: 50,
      }
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini API Summarization Error:", error);
    return "Error generating summary.";
  }
};

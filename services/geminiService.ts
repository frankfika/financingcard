import OpenAI from "openai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { SpeakerType, TranslationResult } from "../types";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
  dangerouslyAllowBrowser: true,
});

export const translateBullshit = async (
  text: string,
  speakerType: SpeakerType
): Promise<TranslationResult> => {
  try {
    const prompt = `
      Speaker: ${speakerType === SpeakerType.FOUNDER ? "Startup Founder (asking for money)" : "Venture Capitalist (holding the money)"}
      Statement: "${text}"

      Translate this into the brutal truth now.

      You MUST respond with a valid JSON object in this exact format:
      {
        "translation": "string - the brutally honest translation in Chinese",
        "bsScore": number - a score from 0-100 indicating how much BS is in the statement,
        "toneAnalysis": "string - 3-5 character Chinese summary of the tone",
        "wittyComment": "string - a witty third-person commentary in Chinese"
      }
    `;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION + "\n\nYou must always respond with valid JSON only, no markdown formatting or code blocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content) as TranslationResult;
    return { ...result, original: text };
  } catch (error) {
    console.error("Translation failed:", error);
    // Fallback for error handling to keep UI stable
    return {
      original: text,
      translation: "系统过热，CPU都烧了也没听懂这句黑话...",
      bsScore: 99,
      toneAnalysis: "System Crash",
      wittyComment: "看来这句谎话连AI都编不下去了。"
    };
  }
};


import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getExplanation = async (expression: string): Promise<string> => {
  try {
    const prompt = `You are a friendly and expert math tutor.
      Provide a clear, step-by-step explanation for how to solve the following mathematical expression.
      Follow the order of operations (PEMDAS/BODMAS).
      Format your response using Markdown, with clear headings for each step.
      Make the explanation easy for a high school student to understand.

      Expression: "${expression}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching explanation from Gemini:", error);
    return "Sorry, I couldn't generate an explanation for this expression. Please try again.";
  }
};

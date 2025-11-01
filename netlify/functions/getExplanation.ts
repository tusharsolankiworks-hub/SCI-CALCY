
import { GoogleGenAI } from "@google/genai";
import type { Handler } from "@netlify/functions";

// This is a Netlify Function, which runs on the server.
// The API_KEY is stored securely as a Netlify environment variable.
if (!process.env.API_KEY) {
  // This error will be visible in the function logs on Netlify
  console.error("API_KEY environment variable not set");
  // Do not throw here as it might expose internal details. Return a generic error instead.
}

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  if (!process.env.API_KEY) {
     return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error: API key is missing.' }),
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const { expression } = JSON.parse(event.body || '{}');

    if (!expression) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Expression is required' }),
      };
    }
    
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
    
    const explanation = response.text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ explanation }),
    };
  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Sorry, the AI service failed to generate an explanation. Please try again." }),
    };
  }
};

export { handler };

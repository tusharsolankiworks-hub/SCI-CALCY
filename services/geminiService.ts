
export const getExplanation = async (expression: string): Promise<string> => {
  try {
    // Call our Netlify serverless function, which securely calls the Gemini API.
    const response = await fetch('/.netlify/functions/getExplanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || 'Network response was not ok');
    }

    const data = await response.json();
    return data.explanation;

  } catch (error) {
    console.error("Error fetching explanation from Netlify function:", error);
    if (error instanceof Error) {
        return `Sorry, an error occurred: ${error.message}`;
    }
    return "Sorry, I couldn't generate an explanation for this expression. Please try again.";
  }
};

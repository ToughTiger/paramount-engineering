
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateBlogPostContent = async (topic: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve("AI functionality is disabled. Please set your API_KEY.");
    }

    const prompt = `Write an engaging and informative blog post for an interior design website. The topic is: "${topic}". The tone should be inspiring, professional, and accessible to a general audience. Structure it with a clear introduction, a few main points in the body, and a concluding paragraph. Use paragraphs for readability. Do not use markdown formatting like headings (#) or bolding (**).`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 1,
                topK: 1,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating blog post:", error);
        return "An error occurred while generating the blog post. Please try again.";
    }
};

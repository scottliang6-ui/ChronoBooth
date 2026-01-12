import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Uses Gemini 2.5 Flash Image to edit the source image by applying a style/era transformation.
 */
export const generateTimeTravelImage = async (
  base64Image: string,
  eraPrompt: string
): Promise<string> => {
  const ai = getClient();
  
  // Using Gemini 2.5 Flash Image as per "Nano banana" instructions for editing tasks
  const modelId = 'gemini-2.5-flash-image';
  
  // Clean base64 string if it has the header
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const prompt = `Transform this person into a character from the following era: ${eraPrompt}. 
  Maintain the facial features, gender, and expression of the person in the original image to ensure they are recognizable. 
  Change the clothing, hairstyle, and background to be historically accurate to the era. 
  High quality, photorealistic, cinematic lighting.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Assuming JPEG from canvas
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates.length > 0) {
        const content = response.candidates[0].content;
        if (content.parts) {
            for (const part of content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
    }

    throw new Error("No image data generated in response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

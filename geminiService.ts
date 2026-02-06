
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

export class GeminiService {
  private static getAI() {
    // Use VITE_GEMINI_API_KEY which is safe to expose on the client
    return new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  }

  // Basic Text / Business Chat (Using gemini-pro for stability)
  static async chatWithBusinessAI(message: string, history: any[] = []) {
    const ai = this.getAI();
    // Using a more stable model and removing tools for troubleshooting
    const model = ai.models.create({ model: 'gemini-pro' });
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });
    
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return {
      text: text,
      sources: [] // Sources are disabled as Google Search tool is removed
    };
  }

  // Low Latency FAQ (Gemini 2.5 Flash Lite)
  static async quickFaq(question: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: question,
      config: {
        systemInstruction: 'Responde de forma extremadamente breve y concisa sobre dudas de distribución de bebidas.'
      }
    });
    return response.text;
  }

  // Image Generation (Gemini 3 Pro Image)
  static async generateMarketingImage(prompt: string, size: '1K' | '2K' | '4K' = '1K') {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `High quality commercial beverage photography: ${prompt}` }] },
      config: {
        imageConfig: { aspectRatio: "1:1", imageSize: size }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image generated');
  }

  // Image Editing (Gemini 2.5 Flash Image)
  static async editProductImage(base64Image: string, prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }

  // Video Generation (Veo 3.1 Fast)
  static async animatePoster(base64Image: string, prompt: string) {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Slow motion refreshing bubbles and water splashes',
      image: {
        imageBytes: base64Image.split(',')[1],
        mimeType: 'image/png'
      },
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${import.meta.env.VITE_GEMINI_API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  // Map Grounding (Gemini 2.5 Flash)
  static async findNearbyDistributors(lat: number, lng: number) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Find wholesale beverage distribution points or large warehouses in this area related to Refrescos Santander or similar businesses.',
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      }
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }
}

// Audio Utils for Live API
export function decodeBase64Audio(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private static getAI() {
    let apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
    
    if (!apiKey && import.meta.env.DEV) {
      console.warn('⚠️ Usando API key de desarrollo temporal.');
      apiKey = 'TU_API_KEY_AQUI';
    }
    
    if (!apiKey) {
      throw new Error('La API key de Gemini no está configurada.');
    }
    
    return new GoogleGenerativeAI(apiKey);
  }

  static async chatWithBusinessAI(message: string, history: any[] = []) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
      
      if (!apiKey) {
        return {
          text: '⚠️ El servicio de IA no está configurado. Contacta al administrador.',
          sources: []
        };
      }

      // ✅ CORRECCIÓN: Usar el modelo correcto (`gemini-1.0-pro`) que es compatible con más API keys.
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error de Gemini:', response.status, errorText);
        
        return {
          text: `⚠️ Error temporal del servicio de IA (${response.status}). Intenta de nuevo.`,
          sources: []
        };
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar una respuesta.';
      
      console.log('✅ Respuesta de Gemini recibida');
      
      return {
        text: text,
        sources: []
      };

    } catch (error: any) {
      console.error('❌ Error en chatWithBusinessAI:', error);
      return {
        text: '❌ Error de conexión. Verifica tu internet.',
        sources: []
      };
    }
  }

  static async quickFaq(question: string) {
    const res = await this.chatWithBusinessAI(question);
    return res.text;
  }

  static async generateMarketingImage(prompt: string, size: '1K' | '2K' | '4K' = '1K') {
    throw new Error('La generación de imágenes requiere un modelo diferente');
  }

  static async editProductImage(base64Image: string, prompt: string) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/png',
                  data: base64Image.split(',')[1]
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) return 'Error al analizar la imagen.';

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo analizar la imagen.';
    } catch {
      return 'Error al analizar la imagen.';
    }
  }

  static async animatePoster(base64Image: string, prompt: string) {
    throw new Error('La generación de videos requiere Veo API');
  }

  static async findNearbyDistributors(lat: number, lng: number) {
    const prompt = `Basándote en las coordenadas ${lat}, ${lng}, sugiere tipos de lugares donde podría encontrar distribuidores de bebidas mayoristas.`;
    return this.chatWithBusinessAI(prompt);
  }
}

// Audio Utils
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
